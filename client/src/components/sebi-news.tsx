import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, FileText, Gavel, Scale, Shield, ExternalLink } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface SebiNewsItem {
  id: string;
  title: string;
  description: string;
  url: string;
  pubDate: string;
  category: string;
  source: string;
  type: string;
  importance: 'high' | 'medium' | 'low';
}

interface SebiNewsProps {
  limit?: number;
}

export function SebiNews({ limit = 10 }: SebiNewsProps) {
  const { data: newsData, isLoading, error } = useQuery({
    queryKey: ['/api/sebi/news', limit],
    queryFn: () => apiRequest('GET', `/api/sebi/news?limit=${limit}`),
    refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'enforcement': return <Gavel className="w-4 h-4" />;
      case 'recovery': return <AlertTriangle className="w-4 h-4" />;
      case 'appeal': return <Scale className="w-4 h-4" />;
      case 'settlement': return <Shield className="w-4 h-4" />;
      case 'compliance': return <FileText className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getImportanceBadge = (importance: string) => {
    switch (importance) {
      case 'high':
        return <Badge variant="destructive" className="text-xs">High Priority</Badge>;
      case 'medium':
        return <Badge variant="default" className="text-xs">Medium</Badge>;
      case 'low':
        return <Badge variant="secondary" className="text-xs">Low</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">General</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const truncateTitle = (title: string, maxLength: number = 100) => {
    return title.length > maxLength ? `${title.substring(0, maxLength)}...` : title;
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-modern rounded-lg flex items-center justify-center">
              <Shield className="text-white w-4 h-4" />
            </div>
            SEBI Regulatory Updates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !newsData?.items || newsData.items.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-modern rounded-lg flex items-center justify-center">
              <Shield className="text-white w-4 h-4" />
            </div>
            SEBI Regulatory Updates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <Shield className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No SEBI updates available at the moment</p>
            <p className="text-sm text-gray-400 mt-2">Please check back later for regulatory updates</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <div className="w-6 h-6 bg-gradient-modern rounded-lg flex items-center justify-center">
            <Shield className="text-white w-4 h-4" />
          </div>
          SEBI Regulatory Updates
          <Badge variant="outline" className="text-xs ml-auto">
            🇮🇳 Indian Market Regulator
          </Badge>
        </CardTitle>
        <p className="text-sm text-gray-600">
          Latest enforcement actions, compliance orders, and regulatory announcements from Securities and Exchange Board of India
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {newsData.items.map((item: SebiNewsItem) => (
            <div
              key={item.id}
              className="group border rounded-lg p-4 hover:bg-blue-50/50 transition-colors cursor-pointer"
              onClick={() => window.open(item.url, '_blank')}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="text-blue-600">
                    {getTypeIcon(item.type)}
                  </div>
                  <h4 className="font-medium text-sm text-gray-900 leading-relaxed group-hover:text-blue-600 transition-colors">
                    {truncateTitle(item.title)}
                  </h4>
                </div>
                <ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0 mt-1" />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getImportanceBadge(item.importance)}
                  <Badge variant="outline" className="text-xs capitalize">
                    {item.type}
                  </Badge>
                </div>
                <span className="text-xs text-gray-500">
                  {formatDate(item.pubDate)}
                </span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Source: Securities and Exchange Board of India</span>
            <span>Updated: {formatDate(newsData.lastBuildDate || new Date().toISOString())}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}