import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Textarea } from './ui/textarea';

interface ReviewSectionProps {
  listingId: string | undefined; 
  currentUser: any;
}

export function ReviewSection({ listingId, currentUser }: ReviewSectionProps) {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch reviews for the specific listing
  const fetchReviews = async () => {
    if (!listingId) return;
    try {
      const res = await fetch(`http://localhost:3000/api/reviews/${listingId}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setReviews(data);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [listingId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Validate User Session
    if (!currentUser || !currentUser.id) {
      alert("Please log in to leave a review!");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('http://localhost:3000/api/reviews/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          // 2. CRITICAL FIX: Convert string ID to Number to match DB INT type
          listing_id: Number(listingId), 
          // 3. Ensure we use 'id' from your Users table
          user_id: currentUser.id, 
          rating, 
          comment 
        }),
      });

      const result = await res.json();

      if (res.ok) {
        setComment('');
        setRating(5);
        fetchReviews(); // Refresh the list
        alert("Feedback submitted successfully!");
      } else {
        // This will display the specific database error (e.g., Foreign Key failure)
        alert(`Error: ${result.error || "Submission failed"}`);
      }
    } catch (err) {
      console.error("Submit error:", err);
      alert("Network error. Please check if the server is running.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-10 space-y-8">
      <h2 className="text-2xl font-bold border-b pb-2">Reviews & Ratings</h2>
      
      <Card>
        <CardHeader><CardTitle className="text-lg">Rate this Place</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star 
                  key={s} 
                  className={`w-6 h-6 cursor-pointer ${rating >= s ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                  onClick={() => setRating(s)} 
                />
              ))}
            </div>
            <Textarea 
              placeholder="What was your stay like?" 
              value={comment} 
              onChange={(e) => setComment(e.target.value)} 
              required 
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Feedback"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {reviews.length > 0 ? reviews.map((r: any) => (
          <Card key={r.review_id}>
            <CardContent className="pt-4">
              <div className="flex justify-between">
                <span className="font-bold text-blue-600">{r.reviewer_name || "Anonymous Student"}</span>
                <div className="flex text-yellow-400">
                  {Array(r.rating).fill(0).map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
              </div>
              <p className="mt-2 text-gray-600 italic">"{r.comment}"</p>
              <p className="text-[10px] text-gray-400 mt-2">
                {new Date(r.created_at).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        )) : <p className="text-gray-500">No reviews yet for this boarding.</p>}
      </div>
    </div>
  );
}