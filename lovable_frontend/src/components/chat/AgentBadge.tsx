import { Badge } from "@/components/ui/badge";

interface AgentBadgeProps {
  agentType: 'General Support' | 'Product Specialist' | 'Technical Support';
  className?: string;
}

const AgentBadge = ({ agentType, className }: AgentBadgeProps) => {
  const getBadgeVariant = (type: string) => {
    switch (type) {
      case 'General Support':
        return 'default';
      case 'Product Specialist':
        return 'secondary';
      case 'Technical Support':
        return 'outline';
      default:
        return 'default';
    }
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'General Support':
        return 'bg-badge-general text-white border-badge-general';
      case 'Product Specialist':
        return 'bg-badge-product text-white border-badge-product';
      case 'Technical Support':
        return 'bg-badge-technical text-white border-badge-technical';
      default:
        return 'bg-badge-general text-white border-badge-general';
    }
  };

  return (
    <Badge variant="secondary" className={`${getBadgeColor(agentType)} ${className}`}>
      {agentType}
    </Badge>
  );
};

export default AgentBadge;