
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

  // Вычисляем процент заполнения шкалы
  const progressValue = Math.min((victories.length / maxVictories) * 100, 100);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-900 text-white">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-blue-400">
            Шкала побед
          </CardTitle>
          <CardDescription className="text-gray-400">
            {loading ? 
              <Skeleton className="h-4 w-32 mx-auto bg-gray-700" /> : 
              `Достижения: ${victories.length} / ${maxVictories}`
            }
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-6 pb-8 px-6">
          <div className="flex">
            {/* Вертикальная шкала достижений */}
            <div className="relative w-full mb-8">
              {/* Шкала */}
              <div className="relative h-[500px] w-8 mx-auto bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="absolute bottom-0 w-full bg-gradient-to-t from-blue-600 to-purple-500 transition-all duration-1000 ease-out"
                  style={{ height: `${progressValue}%` }}
                />
                
                {/* Маркеры делений (через каждые 10%) */}
                {Array.from({ length: 11 }).map((_, index) => (
                  <div 
                    key={`marker-${index}`}
                    className="absolute w-8 h-0.5 bg-gray-600 left-0"
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
                      <div className="w-12 h-12 flex items-center justify-center">
                        <div className="w-5 h-5 bg-blue-500 rounded-full absolute right-1.5 z-10 
                                      group-hover:bg-blue-400 group-hover:scale-125 transition-all"></div>
                        <div className="h-0.5 w-10 bg-blue-500/50 absolute right-6"></div>
                      </div>
                      
                      <div className="absolute right-14 top-0 transform -translate-y-1/2 opacity-0 
                                    group-hover:opacity-100 transition-opacity duration-300 w-56 z-20">
                        <Card className="p-3 bg-gray-800 border-gray-700">
                          <p className="font-medium text-blue-400">{victory.title}</p>
                          <div className="flex justify-between items-center mt-2">
                            <Badge variant="outline" className="text-xs bg-blue-900/30 text-blue-300 border-blue-700">
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
                        <div className="w-12 h-12 flex items-center justify-center">
                          <Skeleton className="w-5 h-5 rounded-full absolute right-1.5 bg-gray-700" />
                          <Skeleton className="h-0.5 w-10 absolute right-6 bg-gray-700" />
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
              <span className="text-xs text-blue-400">0</span>
              <div className="relative w-3/4 h-2">
                <div className="absolute inset-0 rounded-full bg-gray-700"></div>
                <Progress value={progressValue} className="h-2" />
              </div>
              <span className="text-xs text-blue-400">{maxVictories}</span>
            </div>
            <p className="font-medium text-blue-400">
              {loading ? 
                <Skeleton className="h-5 w-40 mx-auto bg-gray-700" /> : 
                `${victories.length} из ${maxVictories} достижений`
              }
            </p>
            <p className="text-sm text-gray-400 mt-1">
              {loading ? 
                <Skeleton className="h-4 w-52 mx-auto bg-gray-700" /> : 
                victories.length === 0 ? "Начните свой путь к славе!" :
                victories.length >= maxVictories ? "Вы достигли легендарного статуса!" :
                `Осталось еще ${maxVictories - victories.length} до максимума`
              }
            </p>
          </div>
        </CardContent>
      </Card>
      
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-400">Данные загружены из battle.txt</p>
        <p className="mt-1 text-xs text-gray-500">
          Наведите на маркеры для просмотра информации
        </p>
      </div>
    </div>
  );
};

export default Index;
