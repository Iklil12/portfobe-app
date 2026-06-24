import { describe, it, expect, vi, beforeEach } from 'vitest';
import { processForgotPassword, processResetPassword } from '../model/authService';
import prisma from '@/shared/lib/prisma';
import bcrypt from 'bcrypt';
import { Resend } from 'resend';

// Mock dependencies
vi.mock('@/shared/lib/prisma', () => ({
  default: {
    user: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    passwordResetToken: {
      deleteMany: vi.fn(),
      create: vi.fn(),
      findUnique: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

vi.mock('bcrypt', () => ({
  default: {
    hash: vi.fn(),
  },
}));

const { sendMock } = vi.hoisted(() => {
  return { sendMock: vi.fn().mockResolvedValue({ id: 'test-email-id' }) };
});

vi.mock('resend', () => {
  return {
    Resend: class {
      emails = { send: sendMock };
    },
  };
});

describe('Auth Service - Feature Layer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('processForgotPassword', () => {
    it('harus mengembalikan true dan tidak mengirim email jika user tidak ditemukan (security measure)', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

      const result = await processForgotPassword('nonexistent@example.com');

      expect(result).toBe(true);
      expect(prisma.passwordResetToken.create).not.toHaveBeenCalled();
      expect(sendMock).not.toHaveBeenCalled();
    });

    it('harus membuat token reset dan mengirim email jika user valid', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        id: '1',
        email: 'test@example.com',
        password: 'hashed-password',
      } as any);

      const result = await processForgotPassword('test@example.com');

      expect(result).toBe(true);
      expect(prisma.passwordResetToken.deleteMany).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
      expect(prisma.passwordResetToken.create).toHaveBeenCalled();
      expect(sendMock).toHaveBeenCalled();
    });
  });

  describe('processResetPassword', () => {
    it('harus melempar error INVALID_DATA jika token atau password kosong', async () => {
      await expect(processResetPassword('', 'password123')).rejects.toThrow('INVALID_DATA');
      await expect(processResetPassword('valid-token', '123')).rejects.toThrow('INVALID_DATA');
    });

    it('harus melempar error INVALID_TOKEN jika token tidak ditemukan di database', async () => {
      vi.mocked(prisma.passwordResetToken.findUnique).mockResolvedValue(null);

      await expect(processResetPassword('fake-token', 'newpassword123')).rejects.toThrow('INVALID_TOKEN');
    });

    it('harus melempar error EXPIRED_TOKEN jika token sudah kedaluwarsa', async () => {
      vi.mocked(prisma.passwordResetToken.findUnique).mockResolvedValue({
        id: '1',
        email: 'test@example.com',
        token: 'expired-token',
        expires: new Date(Date.now() - 10000), // masa lalu
      } as any);

      await expect(processResetPassword('expired-token', 'newpassword123')).rejects.toThrow('EXPIRED_TOKEN');
      expect(prisma.passwordResetToken.delete).toHaveBeenCalledWith({ where: { token: 'expired-token' } });
    });

    it('harus mengupdate password, menghapus token, dan mereturn true jika sukses', async () => {
      vi.mocked(prisma.passwordResetToken.findUnique).mockResolvedValue({
        id: '1',
        email: 'test@example.com',
        token: 'valid-token',
        expires: new Date(Date.now() + 10000), // masa depan
      } as any);
      vi.mocked(bcrypt.hash).mockResolvedValue('new-hashed-password' as never);

      const result = await processResetPassword('valid-token', 'newpassword123');

      expect(result).toBe(true);
      expect(bcrypt.hash).toHaveBeenCalledWith('newpassword123', 10);
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
        data: { password: 'new-hashed-password' }
      });
      expect(prisma.passwordResetToken.delete).toHaveBeenCalledWith({ where: { token: 'valid-token' } });
      expect(sendMock).toHaveBeenCalled(); // Mengirim email notifikasi sukses
    });
  });
});
