export default function checkImageUrl(req, res, next) {
    const { imageUrl } = req.body;
    
    if (!imageUrl) {
        return res.status(400).json({
            message: "Image URL is required"
        });
    }
    
    next(); // If the imageUrl exists, proceed to the next middleware/controller
}