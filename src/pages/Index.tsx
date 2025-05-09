
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Icon from "@/components/ui/icon";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const Index = () => {
  const [victories, setVictories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVictories = async () => {
      try {
        // В реальном приложении здесь был бы API-запрос
        // Симулируем загрузку из файла
        const response = await fetch('/battle.txt');
        if (!response.ok) {
          throw new Error('Файл не найден. Имитируем наличие данных.');
          // Этот код выполнится в случае неуспешного запроса - для демо создаем имитацию данных
        }
        
        const text = await response.text();
        // Разбиваем содержимое файла на строки, каждая строка = 1 победа
        const victories = text.split('\n').filter(line => line.trim() !== '');
        
        setVictories(victories);
        setLoading(false);
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
        // Для демо создаем тестовые данные
        const mockVictories = [
          "Победа над Кромом Жестоким",
          "Сокрушение крепости Рагнарёк",
          "Захват города Норвейл",
          "Победа в битве при Черной Скале",
          "Разгром войск Империи Тьмы",
          "Уничтожение дракона Азерота",
          "Покорение Северных пустошей",
          "Завоевание Восточных степей"
        ];
        setVictories(mockVictories);
        setLoading(false);
      }
    };

    fetchVictories();
  }, []);

  // Вычисляем процент заполнения шкалы (предполагаем максимум в 20 побед для демо)
  const maxVictories = 20;
  const progressValue = Math.min((victories.length / maxVictories) * 100, 100);

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-violet-100 flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white shadow-xl">
        <CardHeader className="text-center bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-t-lg">
          <CardTitle className="text-2xl font-bold">Шкала Побед</CardTitle>
          <CardDescription className="text-violet-100">
            {loading ? 
              <Skeleton className="h-4 w-32 mx-auto bg-violet-300/30" /> : 
              `Всего побед: ${victories.length}`
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 pb-8 px-6">
          <div className="flex">
            {/* Шкала прогресса и маркеры */}
            <div className="relative w-full mb-8">
              {/* Вертикальная шкала */}
              <div className="relative h-[500px] w-8 mx-auto bg-violet-100 rounded-full overflow-hidden">
                <div 
                  className="absolute bottom-0 w-full bg-gradient-to-t from-purple-600 to-violet-500 transition-all duration-1000 ease-out rounded-full"
                  style={{ height: `${progressValue}%` }}
                />
                
                {/* Маркеры делений (через каждые 10%) */}
                {Array.from({ length: 11 }).map((_, index) => (
                  <div 
                    key={`marker-${index}`}
                    className="absolute w-8 h-0.5 bg-violet-200 left-0"
                    style={{ bottom: `${index * 10}%` }}
                  />
                ))}
              </div>

              {/* Маркеры побед */}
              <div className="absolute inset-0">
                {!loading && victories.map((victory, index) => {
                  // Распределяем маркеры побед равномерно по высоте шкалы
                  const position = (index / (maxVictories - 1)) * 100;
                  return (
                    <div 
                      key={`victory-${index}`}
                      className="absolute right-0 w-full flex items-center justify-end animate-fade-in"
                      style={{ bottom: `${(index / Math.max(maxVictories - 1, 1)) * 100}%` }}
                    >
                      <div className="group relative">
                        <div className="w-12 h-12 flex items-center justify-center">
                          <div className="w-5 h-5 bg-white border-2 border-purple-500 rounded-full shadow-md absolute right-1.5 z-10 
                                          group-hover:scale-125 transition-transform"></div>
                          <div className="h-0.5 w-10 bg-violet-300 absolute right-6"></div>
                        </div>
                        
                        <div className="absolute right-14 top-0 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity w-60">
                          <Card className="p-2 text-sm bg-white shadow-lg border border-violet-200">
                            <p className="font-medium text-violet-800">{victory}</p>
                            <Badge variant="outline" className="mt-1 text-xs bg-violet-50">Победа {index + 1}</Badge>
                          </Card>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {loading && (
                  <>
                    {Array.from({ length: 5 }).map((_, index) => (
                      <div 
                        key={`skeleton-${index}`}
                        className="absolute right-0 w-full flex items-center justify-end"
                        style={{ bottom: `${(index / 4) * 100}%` }}
                      >
                        <div className="w-12 h-12 flex items-center justify-center">
                          <Skeleton className="w-5 h-5 rounded-full absolute right-1.5" />
                          <Skeleton className="h-0.5 w-10 absolute right-6" />
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
              <span className="text-xs text-violet-500">0</span>
              <Progress value={progressValue} className="h-2 w-3/4" />
              <span className="text-xs text-violet-500">{maxVictories}</span>
            </div>
            <p className="font-medium text-violet-800">
              {loading ? 
                <Skeleton className="h-5 w-40 mx-auto" /> : 
                `${victories.length} из ${maxVictories} побед`
              }
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {loading ? 
                <Skeleton className="h-4 w-52 mx-auto" /> : 
                victories.length === 0 ? "Начните свой путь к победам!" :
                victories.length >= maxVictories ? "Великолепно! Вы достигли максимума!" :
                `Ещё ${maxVictories - victories.length} до заполнения шкалы`
              }
            </p>
          </div>
        </CardContent>
      </Card>
      
      <div className="mt-6 text-center text-sm text-violet-600">
        <p>Каждая строка в battle.txt = 1 победа</p>
        <p className="mt-1 text-violet-400">Данные обновляются при перезагрузке страницы</p>
      </div>
    </div>
  );
};

export default Index;
