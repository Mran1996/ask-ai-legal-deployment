/**
 * Feature Card Component
 * 
 * This component displays a feature card with an icon, title, and list of points.
 * It's used throughout the application to showcase features and benefits
 * in a consistent, visually appealing format.
 * 
 * @param icon - Emoji or icon to display
 * @param title - Feature title
 * @param points - Array of feature points/benefits
 * @returns A styled feature card component
 */

interface FeatureCardProps {
  /** Icon or emoji to display with the feature */
  icon: string;
  /** Title of the feature */
  title: string;
  /** Array of feature points or benefits */
  points: string[];
}

export function FeatureCard({ icon, title, points }: FeatureCardProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
      {/* Feature header with icon and title */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl" role="img" aria-label={`${title} icon`}>
          {icon}
        </span>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      
      {/* Feature points list */}
      <ul className="space-y-2" role="list">
        {points.map((point, index) => (
          <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
            <span className="text-green-500 mt-0.5 flex-shrink-0" aria-hidden="true">
              •
            </span>
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </div>
  );
} 