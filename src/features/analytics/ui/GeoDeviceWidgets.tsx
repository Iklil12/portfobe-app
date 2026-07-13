import React from 'react';
import { Lock, Globe, Ghost } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function DeviceBreakdown({ isLoading, isFree, handleLocked, deviceData, animReady }: any) {
  const t = useTranslations('DashboardAnalytics');
  if (isLoading) {
    return <div className="rounded-md shimmer-dark h-[400px]" />;
  }

  return (
    <div onClick={isFree ? handleLocked : undefined}
      className={`bg-zinc-950 border border-white/10 rounded-md p-6 md:p-8 shadow-none animate-enter flex flex-col relative overflow-hidden ${isFree ? 'cursor-pointer' : ''}`}
      style={{ animationDelay: '350ms' }}
    >
      {isFree && (
        <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center px-4">
          <div className="w-10 h-10 bg-zinc-900 border border-white/10 text-white rounded-md flex items-center justify-center mb-2">
            <Lock className="w-4 h-4 text-[#ff9e00]" />
          </div>
          <span className="text-xs font-sans font-medium text-[#ff9e00]">{t('proOnly')}</span>
          <p className="text-[10px] text-white/80 font-sans mt-1 text-center">{t('upgradeDevice')}</p>
        </div>
      )}
      <div className="mb-6">
        <h3 className="text-sm font-sans font-medium text-white">{t('widgetDevices')}</h3>
        <p className="text-xs font-sans font-medium text-white/70 mt-1">{t('deviceDistribution')}</p>
      </div>
      <div className="space-y-5 flex-1">
        {deviceData.map((d: any, i: number) => (
          <div key={d.name} className="group">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-md shrink-0" style={{ background: d.color }} />
                <span className="text-sm font-sans text-white/70">{d.name}</span>
              </div>
              <span className="text-sm font-mono font-bold text-white">{d.pct}%</span>
            </div>
            <div className="w-full h-1.5 bg-zinc-900 border border-white/5 rounded-md overflow-hidden">
              <div className="h-full rounded-md transition-all duration-[1200ms] ease-out"
                style={{ width: animReady ? `${d.pct}%` : '0%', background: d.color, transitionDelay: `${i * 100}ms` }}
              />
            </div>
          </div>
        ))}

        <div className="pt-4 mt-4 border-t border-white/5">
          <p className="text-xs font-sans font-medium text-white/70 mb-3">{t('userAgentEst')}</p>
          <div className="grid grid-cols-3 gap-2">
            {deviceData.map((d: any) => (
              <div key={d.name} className="bg-zinc-900/40 rounded-md p-2.5 text-center border border-white/5">
                <p className="text-base font-mono font-bold text-white">{d.pct}%</p>
                <p className="text-xs font-sans text-white/70 mt-0.5">{d.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function TopLocations({ isLoading, isFree, handleLocked, dataList, animReady, title, subtitle }: any) {
  const t = useTranslations('DashboardAnalytics');
  if (isLoading) {
    return <div className="rounded-md shimmer-dark h-[340px]" />;
  }

  return (
    <div onClick={isFree ? handleLocked : undefined}
      className={`bg-zinc-950 border border-white/10 rounded-md p-6 md:p-8 shadow-none animate-enter relative overflow-hidden ${isFree ? 'cursor-pointer' : ''}`}
      style={{ animationDelay: '380ms' }}
    >
      {isFree && (
        <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center px-4">
          <div className="w-10 h-10 bg-zinc-900 border border-white/10 text-white rounded-md flex items-center justify-center mb-2">
            <Lock className="w-4 h-4 text-[#ff9e00]" />
          </div>
          <span className="text-xs font-sans font-medium text-[#ff9e00]">{t('proOnly')}</span>
          <p className="text-[10px] text-white/80 font-sans mt-1 text-center">{t('upgradeLocations')}</p>
        </div>
      )}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-sm font-sans font-medium text-white">{title}</h3>
          <p className="text-xs font-sans font-medium text-white/70 mt-1">{subtitle}</p>
        </div>
        <div className="w-9 h-9 rounded-md bg-zinc-900 border border-white/5 flex items-center justify-center text-white/80">
          <Globe className="w-4 h-4 text-[#ff9e00]" />
        </div>
      </div>
      
      {dataList.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-white/20">
          <Ghost className="w-8 h-8 mb-3" />
          <p className="text-xs font-sans font-medium">{t('noLocationData')}</p>
        </div>
      ) : (
        <div className="space-y-5">
          {dataList.map((item: any, i: number) => (
            <div key={i} className="group/loc">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-sans text-white/80">{item.name}</span>
                </div>
                <div className="text-right">
                  <p className="text-base font-mono font-bold text-white">{item.percentage}%</p>
                  <p className="text-xs font-sans text-white/70 mt-0.5">{t('hitsCount', { count: item.count })}</p>
                </div>
              </div>
              <div className="w-full h-1.5 bg-zinc-900 border border-white/5 rounded-md overflow-hidden">
                <div className="h-full bg-white rounded-md group-hover/loc:bg-[#ff9e00] transition-colors duration-300"
                  style={{ width: animReady ? `${item.percentage}%` : '0%', transition: `width 1.2s cubic-bezier(0.22,1,0.36,1) ${i * 120}ms, background-color 0.3s` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
