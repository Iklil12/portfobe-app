import React from 'react';
import { Target, Ghost, Lock, BarChart3, Share2, MessageSquare, Mail, Phone, Link2, FolderOpen } from 'lucide-react';
import { getSourceIcon, AnimatedCounter } from './AnalyticsShared';
import { useTranslations } from 'next-intl';

export function TopSourcesWidget({ isLoading, isFree, handleLocked, displaySources, animReady }: any) {
  const t = useTranslations('DashboardAnalytics');
  if (isLoading) return <div className="rounded-md shimmer-dark h-[340px]" />;

  return (
    <div onClick={isFree ? handleLocked : undefined}
      className={`bg-zinc-950 border border-white/10 rounded-md p-6 md:p-8 shadow-none animate-enter relative overflow-hidden ${isFree ? 'cursor-pointer' : ''}`}
      style={{ animationDelay: '400ms' }}
    >
      {isFree && (
        <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center px-4">
          <div className="w-10 h-10 bg-zinc-900 border border-white/10 text-white rounded-md flex items-center justify-center mb-2">
            <Lock className="w-4 h-4 text-[#ff9e00]" />
          </div>
          <span className="text-xs font-sans font-medium text-[#ff9e00]">{t('proOnly')}</span>
          <p className="text-[10px] text-white/80 font-sans mt-1 text-center">{t('upgradeSources')}</p>
        </div>
      )}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-sm font-sans font-medium text-white">{t('widgetTopSources')}</h3>
          <p className="text-xs font-sans font-medium text-white/70 mt-1">{t('trafficComesFrom')}</p>
        </div>
        <div className="w-9 h-9 rounded-md bg-zinc-900 border border-white/5 flex items-center justify-center text-white/80">
          <Target className="w-4 h-4 text-[#ff9e00]" />
        </div>
      </div>
      
      {displaySources.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-white/20">
          <Ghost className="w-8 h-8 mb-3" />
          <p className="text-xs font-sans font-medium">{t('noSourcesData')}</p>
        </div>
      ) : (
        <div className="space-y-5">
          {displaySources.map((src: any, i: number) => (
            <div key={i} className="group/src">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-zinc-900 border border-white/5 flex items-center justify-center shrink-0">
                    {getSourceIcon(src.name)}
                  </div>
                  <span className="text-sm font-sans text-white/80">{src.name}</span>
                </div>
                <div className="text-right">
                  <p className="text-base font-mono font-bold text-white">{src.percentage}%</p>
                  <p className="text-xs font-sans text-white/70 mt-0.5">{t('hitsCount', { count: src.count })}</p>
                </div>
              </div>
              <div className="w-full h-1.5 bg-zinc-900 border border-white/5 rounded-md overflow-hidden">
                <div className="h-full bg-white rounded-md group-hover/src:bg-[#ff9e00] transition-colors duration-300"
                  style={{ width: animReady ? `${src.percentage}%` : '0%', transition: `width 1.2s cubic-bezier(0.22,1,0.36,1) ${i * 120}ms, background-color 0.3s` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function ProjectPopularityWidget({ isLoading, isFree, handleLocked, displayProjects, animReady }: any) {
  const t = useTranslations('DashboardAnalytics');
  if (isLoading) return <div className="rounded-md shimmer-dark h-[340px]" />;

  return (
    <div onClick={isFree ? handleLocked : undefined}
      className={`bg-zinc-950 border border-white/10 rounded-md p-6 md:p-8 shadow-none animate-enter relative overflow-hidden ${isFree ? 'cursor-pointer' : ''}`}
      style={{ animationDelay: '480ms' }}
    >
      {isFree && (
        <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center px-4">
          <div className="w-10 h-10 bg-zinc-900 border border-white/10 text-white rounded-md flex items-center justify-center mb-2">
            <Lock className="w-4 h-4 text-[#ff9e00]" />
          </div>
          <span className="text-xs font-sans font-medium text-[#ff9e00]">{t('proOnly')}</span>
          <p className="text-[10px] text-white/80 font-sans mt-1 text-center">{t('upgradeProjectPop')}</p>
        </div>
      )}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-sm font-sans font-medium text-white">{t('widgetProjectPop')}</h3>
          <p className="text-xs font-sans font-medium text-white/70 mt-1">{t('projectPopDesc')}</p>
        </div>
        <div className="w-9 h-9 rounded-md bg-zinc-900 border border-white/5 flex items-center justify-center text-white/80">
          <BarChart3 className="w-4 h-4 text-[#ff9e00]" />
        </div>
      </div>
      
      {displayProjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-white/20">
          <Ghost className="w-8 h-8 mb-3" />
          <p className="text-xs font-sans font-medium">{t('noProjectPopData')}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {displayProjects.map((p: any, i: number) => (
            <div key={i} className="group/proj">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-sans font-medium text-white/80 group-hover/proj:text-[#ff9e00] transition-colors">{String(i + 1).padStart(2, '0')}</span>
                  <span className="text-sm font-sans text-white/80 truncate max-w-[200px] sm:max-w-md">{p.title}</span>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-base font-mono font-bold text-white">{p.percentage}%</p>
                  <p className="text-xs font-sans text-white/70 mt-0.5">{t('clicksCount', { count: p.count })}</p>
                </div>
              </div>
              <div className="w-full h-1.5 bg-zinc-900 border border-white/5 rounded-md overflow-hidden">
                <div className="h-full bg-white rounded-md group-hover/proj:bg-[#ff9e00] transition-colors duration-300"
                  style={{ width: animReady ? `${p.percentage}%` : '0%', transition: `width 1.2s cubic-bezier(0.22,1,0.36,1) ${i * 120}ms, background-color 0.3s` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function SocialMediaWidget({ isLoading, isFree, handleLocked, displaySocialStats, animReady }: any) {
  const t = useTranslations('DashboardAnalytics');
  if (isLoading) return <div className="rounded-md shimmer-dark h-[340px]" />;

  return (
    <div onClick={isFree ? handleLocked : undefined}
      className={`bg-zinc-950 border border-white/10 rounded-md p-6 md:p-8 shadow-none animate-enter relative overflow-hidden ${isFree ? 'cursor-pointer' : ''}`}
      style={{ animationDelay: '500ms' }}
    >
      {isFree && (
        <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center px-4">
          <div className="w-10 h-10 bg-zinc-900 border border-white/10 text-white rounded-md flex items-center justify-center mb-2">
            <Lock className="w-4 h-4 text-[#ff9e00]" />
          </div>
          <span className="text-xs font-sans font-medium text-[#ff9e00]">{t('proOnly')}</span>
          <p className="text-[10px] text-white/80 font-sans mt-1 text-center">{t('upgradeSocialMedia')}</p>
        </div>
      )}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-sm font-sans font-medium text-white">{t('widgetSocialMedia')}</h3>
          <p className="text-xs font-sans font-medium text-white/70 mt-1">{t('socialMediaDesc')}</p>
        </div>
        <div className="w-9 h-9 rounded-md bg-zinc-900 border border-white/5 flex items-center justify-center text-white/80">
          <Share2 className="w-4 h-4 text-[#ff9e00]" />
        </div>
      </div>
      
      {displaySocialStats.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-white/20">
          <Ghost className="w-8 h-8 mb-3" />
          <p className="text-xs font-sans font-medium">{t('noSocialMediaData')}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {displaySocialStats.map((src: any, i: number) => (
            <div key={i} className="group/social">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-zinc-900 border border-white/5 flex items-center justify-center shrink-0">
                    {getSourceIcon(src.name)}
                  </div>
                  <span className="text-sm font-sans text-white/80">{src.name}</span>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-base font-mono font-bold text-white">{src.percentage}%</p>
                  <p className="text-xs font-sans text-white/70 mt-0.5">{t('clicksCount', { count: src.count })}</p>
                </div>
              </div>
              <div className="w-full h-1.5 bg-zinc-900 border border-white/5 rounded-md overflow-hidden">
                <div className="h-full bg-white rounded-md group-hover/social:bg-[#ff9e00] transition-colors duration-300"
                  style={{ width: animReady ? `${src.percentage}%` : '0%', transition: `width 1.2s cubic-bezier(0.22,1,0.36,1) ${i * 120}ms, background-color 0.3s` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function ContactConversionsWidget({ isLoading, isFree, handleLocked, displayContactStats, animReady }: any) {
  const t = useTranslations('DashboardAnalytics');
  if (isLoading) return <div className="rounded-md shimmer-dark h-[340px]" />;

  return (
    <div onClick={isFree ? handleLocked : undefined}
      className={`bg-zinc-950 border border-white/10 rounded-md p-6 md:p-8 shadow-none animate-enter relative overflow-hidden ${isFree ? 'cursor-pointer' : ''}`}
      style={{ animationDelay: '540ms' }}
    >
      {isFree && (
        <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center px-4">
          <div className="w-10 h-10 bg-zinc-900 border border-white/10 text-white rounded-md flex items-center justify-center mb-2">
            <Lock className="w-4 h-4 text-[#ff9e00]" />
          </div>
          <span className="text-xs font-sans font-medium text-[#ff9e00]">{t('proOnly')}</span>
          <p className="text-[10px] text-white/80 font-sans mt-1 text-center">{t('upgradeContactConv')}</p>
        </div>
      )}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-sm font-sans font-medium text-white">{t('widgetContactConv')}</h3>
          <p className="text-xs font-sans font-medium text-white/70 mt-1">{t('contactConvDesc')}</p>
        </div>
        <div className="w-9 h-9 rounded-md bg-zinc-900 border border-white/5 flex items-center justify-center text-white/80">
          <MessageSquare className="w-4 h-4 text-[#ff9e00]" />
        </div>
      </div>
      
      {displayContactStats.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-white/20">
          <Ghost className="w-8 h-8 mb-3" />
          <p className="text-xs font-sans font-medium">{t('noContactConvData')}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {displayContactStats.map((c: any, i: number) => {
            const getContactIcon = (name: string) => {
              if (name === 'WhatsApp') return <MessageSquare className="w-3.5 h-3.5 text-green-500" />;
              if (name === 'Email') return <Mail className="w-3.5 h-3.5 text-blue-400" />;
              if (name === 'Phone') return <Phone className="w-3.5 h-3.5 text-amber-500" />;
              return <Link2 className="w-3.5 h-3.5 text-white/70" />;
            };
            return (
              <div key={i} className="group/contact">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-md bg-zinc-900 border border-white/5 flex items-center justify-center shrink-0">
                      {getContactIcon(c.name)}
                    </div>
                    <span className="text-sm font-sans text-white/80">{c.name}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-base font-mono font-bold text-white">{c.percentage}%</p>
                    <p className="text-xs font-sans text-white/70 mt-0.5">{t('clicksCount', { count: c.count })}</p>
                  </div>
                </div>
                <div className="w-full h-1.5 bg-zinc-900 border border-white/5 rounded-md overflow-hidden">
                  <div className="h-full bg-white rounded-md group-hover/contact:bg-[#ff9e00] transition-colors duration-300"
                    style={{ width: animReady ? `${c.percentage}%` : '0%', transition: `width 1.2s cubic-bezier(0.22,1,0.36,1) ${i * 120}ms, background-color 0.3s` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function GalleryActivityWidget({ isLoading, isFree, handleLocked, galleryClicks }: any) {
  const t = useTranslations('DashboardAnalytics');
  if (isLoading) return <div className="rounded-md shimmer-dark h-[180px]" />;

  return (
    <div onClick={isFree ? handleLocked : undefined}
      className={`bg-zinc-950 border border-white/10 rounded-md p-6 md:p-8 shadow-none animate-enter relative overflow-hidden ${isFree ? 'cursor-pointer' : ''}`}
      style={{ animationDelay: '560ms' }}
    >
      {isFree && (
        <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center px-4">
          <div className="w-10 h-10 bg-zinc-900 border border-white/10 text-white rounded-md flex items-center justify-center mb-2">
            <Lock className="w-4 h-4 text-[#ff9e00]" />
          </div>
          <span className="text-xs font-sans font-medium text-[#ff9e00]">{t('proOnly')}</span>
          <p className="text-[10px] text-white/80 font-sans mt-1 text-center">{t('upgradeGalleryActivity')}</p>
        </div>
      )}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-sm font-sans font-medium text-white">{t('widgetGalleryActivity')}</h3>
          <p className="text-xs font-sans font-medium text-white/70 mt-1">{t('galleryActivityDesc')}</p>
        </div>
        <div className="w-9 h-9 rounded-md bg-zinc-900 border border-white/5 flex items-center justify-center text-white/80">
          <FolderOpen className="w-4 h-4 text-[#ff9e00]" />
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <p className="text-xs font-sans font-medium text-white/70 mb-1">{t('totalClicksGallery')}</p>
          <h4 className="text-4xl md:text-5xl font-mono font-bold text-white tracking-tight">
            <AnimatedCounter value={isFree ? 75 : (galleryClicks || 0)} />
            <span className="text-xs font-sans font-medium text-white/70 ml-2 tracking-normal">{t('clicksSuffix')}</span>
          </h4>
        </div>
        <div className="w-full md:max-w-md bg-zinc-900/40 border border-white/5 p-4 rounded-md flex items-center gap-4">
          <div className="w-10 h-10 bg-zinc-950 border border-white/5 flex items-center justify-center shrink-0">
            <FolderOpen className="w-5 h-5 text-white/80" />
          </div>
          <div>
            <h5 className="text-sm font-sans font-medium text-white/80 tracking-wide">{t('visitorInterest')}</h5>
            <p className="text-xs font-sans text-white/80 leading-relaxed mt-1">{t('visitorInterestDesc')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
