
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Victory } from './types';

const Index = () => {
  const [victories, setVictories] = useState<Victory[]>([]);
  const [loading, setLoading] = useState(true);
  const [maxVictories] = useState(20);
  const [imageLoadErrors, setImageLoadErrors] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const fetchVictories = async () => {
      try {
        const response = await fetch('/battle.txt');
        if (!response.ok) {
          throw new Error('Файл с победами не найден');
        }
        
        const text = await response.text();
        const victoryLines = text.split('\n').filter(line => line.trim() !== '');
        
        const mappedVictories = victoryLines.map((title, index) => ({
          id: index + 1,
          title: title.trim()
        }));
        
        setVictories(mappedVictories);
        setLoading(false);
      } catch (error) {
        console.error("Ошибка при загрузке побед:", error);
        setLoading(false);
      }
    };

    fetchVictories();
  }, []);

  const handleImageError = (id: number) => {
    setImageLoadErrors(prev => ({ ...prev, [id]: true }));
  };

  // Вычисляем процент заполнения шкалы
  const progressValue = Math.min((victories.length / maxVictories) * 100, 100);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-black text-white">
      {/* Неоновый фон с градиентом */}
      <div className="fixed inset-0 bg-black bg-opacity-90 overflow-hidden z-0">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-neon-purple/20 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-neon-blue/20 to-transparent"></div>
        </div>
      </div>
      
      <Card className="w-full max-w-md bg-black/60 border border-neon-blue/30 backdrop-blur-sm shadow-xl shadow-neon-blue/10 z-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-black/95 to-black"></div>
        
        <CardHeader className="text-center relative z-10">
          <CardTitle className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple animate-pulse-neon">
            Шкала побед
          </CardTitle>
          <CardDescription className="text-neon-blue/80">
            {loading ? 
              <Skeleton className="h-4 w-32 mx-auto bg-neon-blue/10" /> : 
              `Достижения: ${victories.length} / ${maxVictories}`
            }
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-6 pb-8 px-6 relative z-10">
          <div className="flex">
            {/* Вертикальная шкала достижений */}
            <div className="relative w-full mb-8">
              {/* Шкала */}
              <div className="relative h-[500px] w-8 mx-auto bg-black/80 rounded-full overflow-hidden 
                            border border-neon-blue/30 shadow-[0_0_5px_theme('colors.neon.blue')]">
                <div 
                  className="absolute bottom-0 w-full bg-gradient-to-t from-neon-blue via-neon-purple to-neon-pink 
                              transition-all duration-1000 ease-out shadow-[0_0_10px_theme('colors.neon.blue')] animate-pulse-neon"
                  style={{ height: `${progressValue}%` }}
                />
                
                {/* Маркеры делений (через каждые 10%) */}
                {Array.from({ length: 11 }).map((_, index) => (
                  <div 
                    key={`marker-${index}`}
                    className="absolute w-8 h-0.5 bg-neon-blue/20 left-0"
                    style={{ bottom: `${index * 10}%` }}
                  />
                ))}
              </div>

              {/* Маркеры побед */}
              <div className="absolute inset-0">
                {!loading && victories.map((victory, index) => (
                  <div 
                    key={`victory-${index}`}
                    className="absolute right-0 w-full flex items-center justify-end"
                    style={{ 
                      bottom: `${(index / Math.max(maxVictories - 1, 1)) * 100}%`
                    }}
                  >
                    <div className="group relative">
                      <div className="w-16 h-12 flex items-center justify-center">
                        <div className="h-0.5 w-10 bg-gradient-to-r from-neon-blue/20 to-neon-blue/80 absolute right-6"></div>
                        <div className="flex items-center justify-center w-6 h-6 absolute right-1 z-10 
                                      transition-all duration-300 
                                      group-hover:scale-125 group-hover:brightness-125">
                          {imageLoadErrors[victory.id] ? (
                            <div className="w-5 h-5 rounded-full 
                                         bg-gradient-to-r from-neon-blue to-neon-purple 
                                         shadow-[0_0_8px_theme('colors.neon.blue')] animate-glow"></div>
                          ) : (
                            <img
                              src={`/image/victory-${victory.id}.png`}
                              alt={victory.title}
                              className="w-full h-full object-contain"
                              onError={() => handleImageError(victory.id)}
                            />
                          )}
                        </div>
                      </div>
                      
                      <div className="absolute right-16 top-0 transform -translate-y-1/2 opacity-0 
                                    group-hover:opacity-100 transition-opacity duration-300 w-64 z-20">
                        <Card className="p-3 bg-black/90 border border-neon-blue/50 
                                       shadow-[0_0_10px_theme('colors.neon.blue'),0_0_5px_theme('colors.neon.purple')] 
                                       backdrop-blur-md">
                          <p className="font-medium text-neon-blue">{victory.title}</p>
                          <div className="flex justify-between items-center mt-2">
                            <Badge className="text-xs bg-neon-purple/20 text-neon-purple border-neon-purple/50">
                              #{victory.id}
                            </Badge>
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
                        <div className="w-16 h-12 flex items-center justify-center">
                          <Skeleton className="h-0.5 w-10 absolute right-6 bg-neon-blue/10" />
                          <Skeleton className="w-5 h-5 rounded-full absolute right-1.5 bg-neon-blue/20" />
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
              <span className="text-xs text-neon-blue">0</span>
              <div className="relative w-3/4 h-2">
                <div className="absolute inset-0 rounded-full bg-black border border-neon-blue/30"></div>
                <Progress 
                  value={progressValue} 
                  className="h-2 [&>div]:bg-gradient-to-r [&>div]:from-neon-blue [&>div]:to-neon-purple [&>div]:animate-pulse-neon"
                />
              </div>
              <span className="text-xs text-neon-blue">{maxVictories}</span>
            </div>
            <p className="font-medium text-neon-purple">
              {loading ? 
                <Skeleton className="h-5 w-40 mx-auto bg-neon-purple/10" /> : 
                `${victories.length} из ${maxVictories} достижений`
              }
            </p>
            <p className="text-sm text-neon-blue/70 mt-1">
              {loading ? 
                <Skeleton className="h-4 w-52 mx-auto bg-neon-blue/10" /> : 
                victories.length === 0 ? "Начните свой путь к славе!" :
                victories.length >= maxVictories ? "Вы достигли легендарного статуса!" :
                `Осталось еще ${maxVictories - victories.length} до максимума`
              }
            </p>
          </div>
        </CardContent>
      </Card>
      
      <div className="mt-4 text-center relative z-10">
        <p className="text-sm text-neon-purple/80">Данные загружены из battle.txt</p>
        <p className="mt-1 text-xs text-neon-blue/60">
          Наведите на маркеры для просмотра информации
        </p>
      </div>
    </div>
  );
};

export default Index;
