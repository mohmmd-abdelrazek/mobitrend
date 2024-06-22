import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

interface RatingProps {
    value: number;
    numReviews: number;
}

const Rating = ({ value, numReviews }: RatingProps) => {
    return (
        <div className="flex items-center gap-2">
            <div className='flex gap-1'>
            {[1, 2, 3, 4, 5].map(star => (
                <span key={star}>
                    {value >= star ? <FaStar color="#ffc107" /> :
                    value >= star - 0.5 ? <FaStarHalfAlt color="#ffc107" /> :
                    <FaRegStar color="#ffc107" />}
                </span>
            ))}
            </div>
            <span className='font-bold text-sm'>({numReviews})</span>
        </div>
    );
};

export default Rating;
