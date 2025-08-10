import { Link, useLoaderData } from 'react-router';
import { ExternalLink } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';

import type { StatsPayload, DecayPoint, CountryHit } from '@/types.d';
import { formatNumber, formatMs, pct, countryName } from '@/lib/utils';

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import CopyButton from '@/components/CopyButton';

export default function UrlDashboard() {
  const data = useLoaderData() as StatsPayload;
  const { link, stats } = data;

  const total = stats.totalHits || 0;
  const uv = stats.uniqueVisitors || 0;

  const desktop = stats.device.desktop ?? 0;
  const mobile = stats.device.mobile ?? 0;
  const deviceTotal = desktop + mobile || 1;

  const topCountries = stats.topCountries ?? [];
  const decay = stats.decayCurve ?? [];

  return (
    <div className='space-y-6'>
      {/* URL / Short + tags */}
      <BreadcrumbNav link={data} />
      <Card>
        <CardHeader className='space-y-2'>
          <CardTitle className='text-base sm:text-lg'>Link</CardTitle>
          <div className='flex flex-col gap-2'>
            <UrlRow label='Original' url={link.originalUrl} />
            <UrlRow label='Short' url={link.shortUrl} />
          </div>

          {link.tags?.length ? (
            <>
              <Separator className='my-2' />
              <div className='flex flex-wrap gap-2'>
                {link.tags.map((t: any) => (
                  <Badge key={t} variant='secondary' className='px-2 py-1'>
                    {t}
                  </Badge>
                ))}
              </div>
            </>
          ) : null}
        </CardHeader>
      </Card>

      {/* KPIs */}
      <div className='grid gap-6 md:grid-cols-3'>
        <KpiCard label='Total Hits' value={formatNumber(total)} />
        <KpiCard label='Unique Visitors' value={formatNumber(uv)} />
        <KpiCard
          label='Avg Redirect Latency'
          value={formatMs(stats.avgRedirectLatencyMs)}
        />
      </div>

      {/* Device split & Countries */}
      <div className='grid gap-6 md:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle>Device Split</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <DeviceRow
              label='Desktop'
              count={desktop}
              percent={pct(desktop, deviceTotal)}
            />
            <DeviceRow
              label='Mobile'
              count={mobile}
              percent={pct(mobile, deviceTotal)}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Countries</CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            <CountryBars data={topCountries} total={total} />
          </CardContent>
        </Card>
      </div>

      {/* Decay curve */}
      <Card>
        <CardHeader>
          <CardTitle>Decay Curve (hits por día)</CardTitle>
        </CardHeader>
        <CardContent>
          <DecayChart data={decay} height={160} />
        </CardContent>
      </Card>
    </div>
  );
}

/* ---------- Subcomponents ---------- */

function BreadcrumbNav({ link }: { link: StatsPayload }) {
  function domainFromUrl(u: string) {
    try {
      return new URL(u).hostname.replace(/^www\./, '');
    } catch {
      return u;
    }
  }

  const title = (link as any)?.title as string | undefined;
  const label = title?.trim() || domainFromUrl(link.link.originalUrl);

  return (
    <Breadcrumb className='mb-4'>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to='/'>Vault</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage className='max-w-[60vw] truncate'>
            {label}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

function UrlRow({ label, url }: { label: string; url: string }) {
  return (
    <div className='flex items-center gap-2'>
      <span className='shrink-0 text-xs uppercase tracking-wide text-muted-foreground w-16'>
        {label}
      </span>
      <a
        href={url}
        target='_blank'
        rel='noreferrer'
        className='truncate text-sm font-medium hover:underline'
      >
        {url}
      </a>
      <ExternalLink className='h-4 w-4 text-muted-foreground' />
      <CopyButton text={url} />
    </div>
  );
}

function KpiCard({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardHeader className='pb-2'>
        <CardTitle className='text-sm text-muted-foreground'>{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-semibold'>{value}</div>
      </CardContent>
    </Card>
  );
}

function DeviceRow({
  label,
  count,
  percent,
}: {
  label: string;
  count: number;
  percent: number;
}) {
  return (
    <div>
      <div className='mb-1 flex items-end justify-between'>
        <span className='text-sm'>{label}</span>
        <span className='text-xs text-muted-foreground'>
          {formatNumber(count)} • {percent.toFixed(0)}%
        </span>
      </div>
      <Progress value={percent} className='h-2' />
    </div>
  );
}

function CountryBars({
  data,
  total,
  maxRows = 7,
}: {
  data: CountryHit[];
  total: number;
  maxRows?: number;
}) {
  const top = [...data].sort((a, b) => b.count - a.count).slice(0, maxRows);
  const max = Math.max(...top.map((d) => d.count), 1);

  return (
    <div className='space-y-2'>
      {top.map((c) => {
        const frac = c.count / max;
        return (
          <div key={c.countryCode} className='space-y-1'>
            <div className='flex justify-between text-xs'>
              <span>{countryName(c.countryCode)}</span>
              <span className='text-muted-foreground'>
                {formatNumber(c.count)} ({pct(c.count, total).toFixed(0)}%)
              </span>
            </div>
            <div className='h-2 w-full rounded bg-muted'>
              <div
                className='h-2 rounded bg-primary'
                style={{ width: `${Math.max(frac * 100, 2)}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function DecayChart({
  data,
  height = 140,
}: {
  data: DecayPoint[];
  height?: number;
}) {
  const max = Math.max(...data.map((d) => d.hits), 1);
  const w = Math.max(data.length * 24, 240); // ancho adaptativo
  const h = height;
  const pad = 8;

  const points = data.map((d, i) => {
    const x = pad + (i / Math.max(data.length - 1, 1)) * (w - pad * 2);
    const y = pad + (1 - d.hits / max) * (h - pad * 2);
    return [x, y] as const;
  });

  const pathD = points
    .map(([x, y], i) => (i === 0 ? `M ${x},${y}` : `L ${x},${y}`))
    .join(' ');

  const areaD = `${pathD} L ${w - pad},${h - pad} L ${pad},${h - pad} Z`;

  return (
    <div className='w-full overflow-x-auto'>
      <svg width={w} height={h} className='block'>
        <defs>
          <linearGradient id='decayGrad' x1='0' x2='0' y1='0' y2='1'>
            <stop
              offset='0%'
              stopColor='hsl(var(--primary))'
              stopOpacity='0.6'
            />
            <stop
              offset='100%'
              stopColor='hsl(var(--primary))'
              stopOpacity='0'
            />
          </linearGradient>
        </defs>

        {/* área */}
        <path d={areaD} fill='url(#decayGrad)' />
        {/* línea */}
        <path
          d={pathD}
          fill='none'
          stroke='hsl(var(--primary))'
          strokeWidth={2}
        />
        {/* puntos */}
        {points.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={2} fill='hsl(var(--primary))' />
        ))}
      </svg>
      <div className='mt-2 flex justify-between text-xs text-muted-foreground'>
        <span>{data[0]?.day ?? ''}</span>
        <span>{data[data.length - 1]?.day ?? ''}</span>
      </div>
    </div>
  );
}
