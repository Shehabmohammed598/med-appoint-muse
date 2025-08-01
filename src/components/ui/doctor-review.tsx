import { useState } from 'react';
import { Star, MessageCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface DoctorReviewProps {
  doctorName: string;
  onSubmit: (rating: number, comment: string) => void;
  onSkip: () => void;
}

export function DoctorReview({ doctorName, onSubmit, onSkip }: DoctorReviewProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    if (rating > 0) {
      onSubmit(rating, comment);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center flex items-center justify-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Rate Your Experience
        </CardTitle>
        <p className="text-center text-muted-foreground text-sm">
          How was your appointment with {doctorName}?
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Star Rating */}
        <div className="flex justify-center space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="transition-colors"
            >
              <Star
                className={cn(
                  "h-8 w-8 transition-colors",
                  star <= (hoveredRating || rating)
                    ? "text-yellow-500 fill-yellow-500"
                    : "text-muted-foreground"
                )}
              />
            </button>
          ))}
        </div>

        {/* Rating Text */}
        {rating > 0 && (
          <div className="text-center text-sm font-medium">
            {rating === 1 && "Poor"}
            {rating === 2 && "Fair"}
            {rating === 3 && "Good"}
            {rating === 4 && "Very Good"}
            {rating === 5 && "Excellent"}
          </div>
        )}

        {/* Comment */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Share your feedback (optional)
          </label>
          <Textarea
            placeholder="Tell us about your experience..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="min-h-[80px]"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button variant="outline" onClick={onSkip} className="flex-1">
            Skip for Now
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={rating === 0}
            className="flex-1"
          >
            Submit Review
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}