
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfigData, Victory } from './types';

const Index = () => {
  const [config, setConfig] = useState<ConfigData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch('/config.json');
        if (!response.ok) {
          throw new Error('Файл конфигурации не найден');
        }
        
        const data = await response.json();
        setConfig(data);
        setLoading(false);
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  // Вычисляем процент заполнения шкалы
  const maxVictories = config?.maxVictories || 20;
  const victories = config?.victories || [];
  const progressValue = Math.min((victories.length / maxVictories) * 100, 100);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 overflow-hidden">
      {/* Фоновый неоновый эффект */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-[10%] blur-3xl opacity-30 animate-pulse bg-gradient-radial from-cyan-500 via-transparent to-transparent"></div>
        <div className="absolute -inset-[5%] blur-3xl opacity-20 animate-pulse bg-gradient-radial from-purple-600 via-transparent to-transparent" style={{animationDelay: '1s'}}></div>
      </div>
      
      <Card className="w-full max-w-md bg-black/60 backdrop-blur-sm border border-cyan-500/30 shadow-2xl shadow-cyan-500/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-purple-500/5"></div>
        
        <CardHeader className="text-center relative z-10">
          <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 w-40 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent blur-sm"></div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent drop-shadow-sm">
            НЕОНОВАЯ ШКАЛА
          </CardTitle>
          <CardDescription className="text-cyan-200/80">
            {loading ? 
              <Skeleton className="h-4 w-32 mx-auto bg-cyan-800/30" /> : 
              `Достижения: ${victories.length} / ${maxVictories}`
            }
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-6 pb-8 px-6 relative z-10">
          <div className="flex">
            {/* Вертикальная шкала достижений */}
            <div className="relative w-full mb-8">
              {/* Неоновая шкала */}
              <div className="relative h-[500px] w-8 mx-auto bg-black/60 rounded-full overflow-hidden border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                <div 
                  className="absolute bottom-0 w-full bg-gradient-to-t from-purple-600 to-cyan-400 transition-all duration-1000 ease-out rounded-full shadow-[0_0_10px_rgba(6,182,212,0.6),inset_0_0_10px_rgba(168,85,247,0.4)]"
                  style={{ height: `${progressValue}%` }}
                />
                
                {/* Маркеры делений (через каждые 10%) */}
                {Array.from({ length: 11 }).map((_, index) => (
                  <div 
                    key={`marker-${index}`}
                    className="absolute w-8 h-0.5 bg-cyan-800/40 left-0"
                    style={{ bottom: `${index * 10}%` }}
                  />
                ))}
              </div>

              {/* Маркеры побед */}
              <div className="absolute inset-0">
                {!loading && victories.map((victory, index) => (
                  <div 
                    key={`victory-${index}`}
                    className="absolute right-0 w-full flex items-center justify-end animate-fade-in"
                    style={{ 
                      bottom: `${(index / Math.max(maxVictories - 1, 1)) * 100}%`,
                      animationDelay: `${index * 0.15}s` 
                    }}
                  >
                    <div className="group relative">
                      <div className="w-12 h-12 flex items-center justify-center">
                        <div className="w-10 h-10 flex items-center justify-center absolute right-1 z-10 
                                        group-hover:scale-125 transition-transform duration-300">
                          <img 
                            src={`/image/victory-${victory.id}.png`} 
                            alt={victory.name}
                            onError={(e) => {
                              // Fallback to a neon circle if image doesn't load
                              (e.target as HTMLImageElement).style.display = 'none';
                              (e.target as HTMLImageElement).nextElementSibling!.style.display = 'block';
                            }}
                            className="w-full h-full object-contain drop-shadow-[0_0_5px_rgba(6,182,212,0.8)]"
                          />
                          <div 
                            className="w-5 h-5 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full hidden
                                      shadow-[0_0_8px_rgba(6,182,212,0.8)]"
                          ></div>
                        </div>
                        <div className="h-0.5 w-10 bg-gradient-to-r from-cyan-400 to-transparent absolute right-6 group-hover:w-14 transition-all duration-300"></div>
                      </div>
                      
                      <div className="absolute right-14 top-0 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-72 z-20">
                        <Card className="p-3 bg-black/80 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.5)] backdrop-blur-sm">
                          <p className="font-medium text-cyan-300 text-sm">{victory.name}</p>
                          {victory.description && (
                            <p className="text-xs text-cyan-100/70 mt-1">{victory.description}</p>
                          )}
                          <div className="flex justify-between items-center mt-2">
                            <Badge variant="outline" className="text-xs bg-purple-900/30 text-purple-300 border-purple-500/30">
                              #{victory.id}
                            </Badge>
                            {victory.date && (
                              <span className="text-xs text-cyan-400/60">{victory.date}</span>
                            )}
                          </div>
                        </Card>
                      </div>
                    </div>
                  </div>
                ))}

                {loading && (
                  <>
                    {Array.from({ length: 5 }).map((_, index) => (
                      <div 
                        key={`skeleton-${index}`}
                        className="absolute right-0 w-full flex items-center justify-end"
                        style={{ bottom: `${(index / 4) * 100}%` }}
                      >
                        <div className="w-12 h-12 flex items-center justify-center">
                          <Skeleton className="w-5 h-5 rounded-full absolute right-1.5 bg-cyan-900/50" />
                          <Skeleton className="h-0.5 w-10 absolute right-6 bg-cyan-900/30" />
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Информация о прогрессе */}
          <div className="mt-6 text-center">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-cyan-500">0</span>
              <div className="relative w-3/4 h-2">
                <div className="absolute inset-0 rounded-full bg-black/60 border border-cyan-500/20"></div>
                <Progress value={progressValue} className="h-2 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.5)]" />
              </div>
              <span className="text-xs text-cyan-500">{maxVictories}</span>
            </div>
            <p className="font-medium text-gradient bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              {loading ? 
                <Skeleton className="h-5 w-40 mx-auto bg-cyan-900/30" /> : 
                `${victories.length} из ${maxVictories} достижений`
              }
            </p>
            <p className="text-sm text-cyan-400/60 mt-1">
              {loading ? 
                <Skeleton className="h-4 w-52 mx-auto bg-cyan-900/30" /> : 
                victories.length === 0 ? "Начните свой путь к славе!" :
                victories.length >= maxVictories ? "Невероятно! Вы достигли легендарного статуса!" :
                `Осталось еще ${maxVictories - victories.length} до максимума`
              }
            </p>
          </div>
        </CardContent>
        
        {/* Неоновые декоративные элементы */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent blur-sm"></div>
        <div className="absolute -bottom-1 -right-1 w-10 h-10 rounded-full bg-cyan-500 blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute -top-1 -left-1 w-10 h-10 rounded-full bg-purple-500 blur-xl opacity-30 animate-pulse" style={{animationDelay: '0.5s'}}></div>
      </Card>
      
      <div className="mt-8 text-center relative z-10">
        <p className="text-sm text-cyan-400/80">Данные загружены из config.json</p>
        <p className="mt-1 text-xs text-purple-400/60">
          Наведите на маркеры для просмотра подробностей о победах
        </p>
      </div>
    </div>
  );
};

export default Index;
