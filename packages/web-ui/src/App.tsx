import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './components/ui/card';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';

function App() {
  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='container mx-auto px-4 py-8'>
        <header className='text-center mb-12'>
          <h1 className='text-4xl font-bold text-gray-900 mb-4'>
            🚀 Mono Repo Web UI
          </h1>
          <p className='text-xl text-gray-600'>
            Современный веб-интерфейс с React и Radix UI
          </p>
        </header>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          <Card>
            <CardHeader>
              <CardTitle>Backend API</CardTitle>
              <CardDescription>
                Статус подключения к backend серверу
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='flex flex-wrap gap-2'>
                <Badge variant='outline'>Порт: 3000</Badge>
                <Badge variant='outline'>Окружение: development</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Radix UI Компоненты</CardTitle>
              <CardDescription>
                Демонстрация компонентов Radix UI
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='flex flex-wrap gap-2'>
                <Button variant='default' size='sm'>
                  Primary
                </Button>
                <Button variant='outline' size='sm'>
                  Outline
                </Button>
                <Button variant='ghost' size='sm'>
                  Ghost
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Технологии</CardTitle>
              <CardDescription>
                Используемые технологии в проекте
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='flex flex-wrap gap-2'>
                <Badge variant='secondary'>React 18</Badge>
                <Badge variant='secondary'>Radix UI</Badge>
                <Badge variant='secondary'>TypeScript</Badge>
                <Badge variant='secondary'>Tailwind CSS</Badge>
                <Badge variant='secondary'>Bun</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default App;
