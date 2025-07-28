import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './components/ui/card';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import {
  Users,
  Database,
  Settings,
  Activity,
  Shield,
  BarChart3,
  UserCheck,
  AlertTriangle,
  CheckCircle,
  Clock,
} from 'lucide-react';

function App() {
  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <header className='bg-white shadow-sm border-b'>
        <div className='container mx-auto px-4 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-3'>
              <Shield className='h-8 w-8 text-blue-600' />
              <div>
                <h1 className='text-2xl font-bold text-gray-900'>
                  Admin Panel
                </h1>
                <p className='text-sm text-gray-600'>
                  Mono Repo Administration
                </p>
              </div>
            </div>
            <div className='flex items-center space-x-4'>
              <Badge
                variant='outline'
                className='bg-green-50 text-green-700 border-green-200'
              >
                <CheckCircle className='h-3 w-3 mr-1' />
                Online
              </Badge>
              <Button variant='outline' size='sm'>
                <Settings className='h-4 w-4 mr-2' />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className='container mx-auto px-4 py-8'>
        {/* Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Total Users</CardTitle>
              <Users className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>1,234</div>
              <p className='text-xs text-muted-foreground'>
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Active Sessions
              </CardTitle>
              <Activity className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>89</div>
              <p className='text-xs text-muted-foreground'>Currently online</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Database Size
              </CardTitle>
              <Database className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>2.4 GB</div>
              <p className='text-xs text-muted-foreground'>
                +8% from last week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                System Health
              </CardTitle>
              <BarChart3 className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold text-green-600'>98%</div>
              <p className='text-xs text-muted-foreground'>
                All systems operational
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue='overview' className='space-y-6'>
          <TabsList className='grid w-full grid-cols-4'>
            <TabsTrigger value='overview'>Overview</TabsTrigger>
            <TabsTrigger value='users'>Users</TabsTrigger>
            <TabsTrigger value='system'>System</TabsTrigger>
            <TabsTrigger value='logs'>Logs</TabsTrigger>
          </TabsList>

          <TabsContent value='overview' className='space-y-6'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Latest system events and user actions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='space-y-4'>
                    <div className='flex items-center space-x-3'>
                      <UserCheck className='h-4 w-4 text-green-600' />
                      <div className='flex-1'>
                        <p className='text-sm font-medium'>
                          New user registered
                        </p>
                        <p className='text-xs text-muted-foreground'>
                          john.doe@example.com
                        </p>
                      </div>
                      <Clock className='h-4 w-4 text-muted-foreground' />
                      <span className='text-xs text-muted-foreground'>
                        2 min ago
                      </span>
                    </div>
                    <div className='flex items-center space-x-3'>
                      <AlertTriangle className='h-4 w-4 text-yellow-600' />
                      <div className='flex-1'>
                        <p className='text-sm font-medium'>High memory usage</p>
                        <p className='text-xs text-muted-foreground'>
                          Server: backend-01
                        </p>
                      </div>
                      <Clock className='h-4 w-4 text-muted-foreground' />
                      <span className='text-xs text-muted-foreground'>
                        5 min ago
                      </span>
                    </div>
                    <div className='flex items-center space-x-3'>
                      <CheckCircle className='h-4 w-4 text-green-600' />
                      <div className='flex-1'>
                        <p className='text-sm font-medium'>Backup completed</p>
                        <p className='text-xs text-muted-foreground'>
                          Database backup successful
                        </p>
                      </div>
                      <Clock className='h-4 w-4 text-muted-foreground' />
                      <span className='text-xs text-muted-foreground'>
                        1 hour ago
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common administrative tasks</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='grid grid-cols-2 gap-4'>
                    <Button variant='outline' className='h-20 flex-col'>
                      <Users className='h-6 w-6 mb-2' />
                      <span className='text-sm'>Manage Users</span>
                    </Button>
                    <Button variant='outline' className='h-20 flex-col'>
                      <Database className='h-6 w-6 mb-2' />
                      <span className='text-sm'>Database</span>
                    </Button>
                    <Button variant='outline' className='h-20 flex-col'>
                      <Settings className='h-6 w-6 mb-2' />
                      <span className='text-sm'>Settings</span>
                    </Button>
                    <Button variant='outline' className='h-20 flex-col'>
                      <BarChart3 className='h-6 w-6 mb-2' />
                      <span className='text-sm'>Analytics</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value='users' className='space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  Manage system users and permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center space-x-3'>
                      <div className='w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center'>
                        <span className='text-sm font-medium text-blue-600'>
                          JD
                        </span>
                      </div>
                      <div>
                        <p className='text-sm font-medium'>John Doe</p>
                        <p className='text-xs text-muted-foreground'>
                          john.doe@example.com
                        </p>
                      </div>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <Badge variant='secondary'>USER</Badge>
                      <Button variant='outline' size='sm'>
                        Edit
                      </Button>
                    </div>
                  </div>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center space-x-3'>
                      <div className='w-8 h-8 bg-green-100 rounded-full flex items-center justify-center'>
                        <span className='text-sm font-medium text-green-600'>
                          AS
                        </span>
                      </div>
                      <div>
                        <p className='text-sm font-medium'>Admin User</p>
                        <p className='text-xs text-muted-foreground'>
                          admin@example.com
                        </p>
                      </div>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <Badge variant='default'>ADMIN</Badge>
                      <Button variant='outline' size='sm'>
                        Edit
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='system' className='space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle>System Information</CardTitle>
                <CardDescription>
                  Current system status and configuration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <p className='text-sm font-medium'>Backend API</p>
                    <p className='text-xs text-muted-foreground'>Port: 3000</p>
                    <Badge variant='outline' className='mt-1'>
                      Running
                    </Badge>
                  </div>
                  <div>
                    <p className='text-sm font-medium'>Web UI</p>
                    <p className='text-xs text-muted-foreground'>Port: 3001</p>
                    <Badge variant='outline' className='mt-1'>
                      Running
                    </Badge>
                  </div>
                  <div>
                    <p className='text-sm font-medium'>Database</p>
                    <p className='text-xs text-muted-foreground'>PostgreSQL</p>
                    <Badge variant='outline' className='mt-1'>
                      Connected
                    </Badge>
                  </div>
                  <div>
                    <p className='text-sm font-medium'>Environment</p>
                    <p className='text-xs text-muted-foreground'>Development</p>
                    <Badge variant='outline' className='mt-1'>
                      Active
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='logs' className='space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle>System Logs</CardTitle>
                <CardDescription>Recent system logs and events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-2'>
                  <div className='text-xs font-mono bg-gray-100 p-2 rounded'>
                    [2025-07-28 23:05:12] INFO: Server started on port 3000
                  </div>
                  <div className='text-xs font-mono bg-gray-100 p-2 rounded'>
                    [2025-07-28 23:05:15] INFO: Database connection established
                  </div>
                  <div className='text-xs font-mono bg-gray-100 p-2 rounded'>
                    [2025-07-28 23:05:20] INFO: Web UI started on port 3001
                  </div>
                  <div className='text-xs font-mono bg-gray-100 p-2 rounded'>
                    [2025-07-28 23:06:00] INFO: User authentication successful
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default App;
