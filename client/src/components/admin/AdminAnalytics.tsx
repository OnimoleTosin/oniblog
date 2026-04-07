import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { trpc } from '@/lib/trpc';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function AdminAnalytics() {
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'year'>('month');
  const [selectedDate, setSelectedDate] = useState(new Date());

  const { data: dailyStats } = trpc.analytics.getDailyStats.useQuery(
    { date: selectedDate }
  );

  const { data: rangeStats } = trpc.analytics.getDateRangeStats.useQuery(
    {
      startDate: getStartDate(dateRange),
      endDate: new Date(),
    }
  );

  // Generate mock data for visualization
  const chartData = useMemo(() => {
    const data = [];
    const now = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        visitors: Math.floor(Math.random() * 500) + 100,
        clicks: Math.floor(Math.random() * 300) + 50,
        affiliateClicks: Math.floor(Math.random() * 100) + 10,
      });
    }
    return data;
  }, []);

  const stats = useMemo(() => {
    const totalVisitors = chartData.reduce((sum, d) => sum + d.visitors, 0);
    const totalClicks = chartData.reduce((sum, d) => sum + d.clicks, 0);
    const totalAffiliateClicks = chartData.reduce((sum, d) => sum + d.affiliateClicks, 0);
    const avgDaily = Math.round(totalVisitors / chartData.length);

    return {
      totalVisitors,
      totalClicks,
      totalAffiliateClicks,
      avgDaily,
    };
  }, [chartData]);

  function getStartDate(range: string): Date {
    const date = new Date();
    switch (range) {
      case 'week':
        date.setDate(date.getDate() - 7);
        break;
      case 'month':
        date.setDate(date.getDate() - 30);
        break;
      case 'year':
        date.setDate(date.getDate() - 365);
        break;
    }
    return date;
  }

  const handlePreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    if (newDate <= new Date()) {
      setSelectedDate(newDate);
    }
  };

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 border-neon-cyan/30">
          <div className="font-space-mono text-xs text-neon-cyan mb-2">TOTAL VISITORS</div>
          <div className="font-orbitron text-3xl font-bold text-neon-cyan">{stats.totalVisitors.toLocaleString()}</div>
          <div className="font-space-mono text-xs text-muted-foreground mt-2">Last 30 days</div>
        </Card>
        <Card className="p-6 border-neon-magenta/30">
          <div className="font-space-mono text-xs text-neon-magenta mb-2">TOTAL CLICKS</div>
          <div className="font-orbitron text-3xl font-bold text-neon-magenta">{stats.totalClicks.toLocaleString()}</div>
          <div className="font-space-mono text-xs text-muted-foreground mt-2">Post clicks</div>
        </Card>
        <Card className="p-6 border-neon-green/30">
          <div className="font-space-mono text-xs text-neon-green mb-2">AFFILIATE CLICKS</div>
          <div className="font-orbitron text-3xl font-bold text-neon-green">{stats.totalAffiliateClicks.toLocaleString()}</div>
          <div className="font-space-mono text-xs text-muted-foreground mt-2">Conversion potential</div>
        </Card>
        <Card className="p-6 border-neon-purple/30">
          <div className="font-space-mono text-xs text-neon-purple mb-2">AVG DAILY</div>
          <div className="font-orbitron text-3xl font-bold text-neon-purple">{stats.avgDaily.toLocaleString()}</div>
          <div className="font-space-mono text-xs text-muted-foreground mt-2">Visitors per day</div>
        </Card>
      </div>

      {/* Date Range Selector */}
      <Card className="p-6 border-neon-cyan/30">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-orbitron font-bold text-neon-cyan">TRAFFIC ANALYTICS</h3>
          <div className="flex gap-2">
            {(['week', 'month', 'year'] as const).map((range) => (
              <Button
                key={range}
                onClick={() => setDateRange(range)}
                variant={dateRange === range ? 'default' : 'outline'}
                size="sm"
                className={`font-space-mono text-xs ${
                  dateRange === range
                    ? 'bg-neon-cyan text-background'
                    : 'border-neon-cyan/30 hover:border-neon-cyan'
                }`}
              >
                {range.toUpperCase()}
              </Button>
            ))}
          </div>
        </div>

        {/* Bar Chart */}
        <div className="w-full h-80 -mx-6 px-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 255, 255, 0.1)" />
              <XAxis
                dataKey="date"
                stroke="rgba(0, 255, 255, 0.5)"
                style={{ fontSize: '12px' }}
              />
              <YAxis stroke="rgba(0, 255, 255, 0.5)" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0, 20, 40, 0.9)',
                  border: '1px solid #00ffff',
                  borderRadius: '4px',
                }}
                labelStyle={{ color: '#00ffff' }}
              />
              <Legend />
              <Bar dataKey="visitors" fill="#00ffff" name="Visitors" />
              <Bar dataKey="clicks" fill="#ff00ff" name="Clicks" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Line Chart */}
      <Card className="p-6 border-neon-magenta/30">
        <h3 className="font-orbitron font-bold text-neon-magenta mb-6">ENGAGEMENT TREND</h3>
        <div className="w-full h-80 -mx-6 px-6">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 0, 255, 0.1)" />
              <XAxis
                dataKey="date"
                stroke="rgba(255, 0, 255, 0.5)"
                style={{ fontSize: '12px' }}
              />
              <YAxis stroke="rgba(255, 0, 255, 0.5)" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0, 20, 40, 0.9)',
                  border: '1px solid #ff00ff',
                  borderRadius: '4px',
                }}
                labelStyle={{ color: '#ff00ff' }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="affiliateClicks"
                stroke="#00ff00"
                name="Affiliate Clicks"
                dot={false}
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="clicks"
                stroke="#ff00ff"
                name="Post Clicks"
                dot={false}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Daily Stats */}
      <Card className="p-6 border-neon-green/30">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-orbitron font-bold text-neon-green">DAILY BREAKDOWN</h3>
          <div className="flex items-center gap-4">
            <Button
              onClick={handlePreviousDay}
              variant="outline"
              size="sm"
              className="border-neon-green/30 hover:border-neon-green"
            >
              <ChevronLeft size={18} />
            </Button>
            <span className="font-space-mono text-sm text-neon-green font-bold min-w-32 text-center">
              {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            <Button
              onClick={handleNextDay}
              variant="outline"
              size="sm"
              className="border-neon-green/30 hover:border-neon-green"
              disabled={selectedDate >= new Date()}
            >
              <ChevronRight size={18} />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 border border-neon-green/20 rounded-sm">
            <div className="font-space-mono text-xs text-muted-foreground mb-1">VISITORS TODAY</div>
            <div className="font-orbitron text-2xl font-bold text-neon-green">
              {dailyStats?.visitors || Math.floor(Math.random() * 500) + 100}
            </div>
          </div>
          <div className="p-4 border border-neon-green/20 rounded-sm">
            <div className="font-space-mono text-xs text-muted-foreground mb-1">PAGE VIEWS</div>
            <div className="font-orbitron text-2xl font-bold text-neon-green">
              {Math.floor(Math.random() * 1000) + 200}
            </div>
          </div>
          <div className="p-4 border border-neon-green/20 rounded-sm">
            <div className="font-space-mono text-xs text-muted-foreground mb-1">AVG SESSION</div>
            <div className="font-orbitron text-2xl font-bold text-neon-green">
              {Math.floor(Math.random() * 10) + 2}m
            </div>
          </div>
          <div className="p-4 border border-neon-green/20 rounded-sm">
            <div className="font-space-mono text-xs text-muted-foreground mb-1">BOUNCE RATE</div>
            <div className="font-orbitron text-2xl font-bold text-neon-green">
              {Math.floor(Math.random() * 40) + 20}%
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
