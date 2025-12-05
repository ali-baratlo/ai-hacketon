// A simple global variable to hold our data.
// In a real application, you would fetch this from an API.
const restaurantData = window.restaurantData;

document.addEventListener('DOMContentLoaded', () => {
    // Determine which page we are on and call the appropriate function.
    if (document.getElementById('restaurant-listings')) {
        renderRestaurantListings();
    } else if (document.getElementById('restaurant-detail')) {
        renderRestaurantDetail();
    }
});

/**
 * Renders the list of all restaurants on the main page (index.html).
 */
function renderRestaurantListings() {
    const container = document.getElementById('restaurant-listings');
    if (!restaurantData) {
        container.innerHTML = '<p>اطلاعات رستوران یافت نشد.</p>';
        return;
    }

    const listingsHtml = restaurantData.map(resto => `
        <a href="restaurant.html?id=${resto.restaurant_id}" class="restaurant-listing-card">
            <img src="https://picsum.photos/seed/${resto.restaurant_id}/400/250" alt="${resto.restaurant_name}" class="listing-photo">
            <div class="listing-info">
                <h3>${resto.restaurant_name}</h3>
                <div class="listing-details">
                    <span class="rating">⭐ ${resto.restaurant_info.rating}</span>
                    <span class="category">${resto.restaurant_info.category}</span>
                    <span class="price">${resto.restaurant_info.price_range}</span>
                </div>
            </div>
        </a>
    `).join('');

    container.innerHTML = listingsHtml;
}

/**
 * Renders the detailed view for a single restaurant on restaurant.html.
 */
function renderRestaurantDetail() {
    const container = document.getElementById('restaurant-detail');
    const header = document.getElementById('restaurant-name-header');

    // Get the restaurant ID from the URL query parameter.
    const urlParams = new URLSearchParams(window.location.search);
    const restaurantId = parseInt(urlParams.get('id'), 10);

    if (isNaN(restaurantId) || !restaurantData) {
        container.innerHTML = '<p>رستوران مورد نظر یافت نشد.</p>';
        return;
    }

    const resto = restaurantData.find(r => r.restaurant_id === restaurantId);

    if (!resto) {
        container.innerHTML = '<p>اطلاعات این رستوران موجود نیست.</p>';
        return;
    }

    header.textContent = resto.restaurant_name;

    const detailHtml = `
        <div class="restaurant-page-header">
            <img src="https://picsum.photos/seed/${resto.restaurant_id}/800/400" alt="${resto.restaurant_name}" class="restaurant-main-photo">
            <div class="restaurant-meta">
                <h2>${resto.restaurant_name}</h2>
                <p>${resto.restaurant_info.category} • ${resto.restaurant_info.location}</p>
                <div class="meta-details">
                    <span class="rating">⭐ ${resto.restaurant_info.rating}</span>
                    <span class="price">${resto.restaurant_info.price_range}</span>
                    <span class="delivery">میانگین تحویل: ${resto.restaurant_info.avg_delivery_time} دقیقه</span>
                </div>
            </div>
        </div>

        <!-- AI Insights Section -->
        <div class="ai-summary-box">
            <h3>✨ تحلیل هوشمند نظرات ✨</h3>
            <p class="summary-text">${resto.ai_summary}</p>
            <div class="summary-keywords">
                <div>
                    <strong>نکات مثبت اصلی:</strong>
                    <span>${resto.top_themes.top_positive_themes.join('، ') || 'موردی یافت نشد'}</span>
                </div>
                <div>
                    <strong>نکات منفی اصلی:</strong>
                    <span>${resto.top_themes.top_negative_themes.join('، ') || 'موردی یافت نشد'}</span>
                </div>
            </div>
        </div>

        <!-- User Comments Section -->
        <div class="comments-section">
            <h3>نظرات کاربران (${resto.sentiment_summary.total_reviews})</h3>
            <div class="comments-list">
                ${resto.user_comments.map(comment => `
                    <div class="comment-card sentiment-${comment.sentiment}">
                        <div class="comment-header">
                            <span class="comment-rating">⭐ ${comment.user_rating}</span>
                            <span class="comment-date">${new Date(comment.created_at).toLocaleDateString('fa-IR')}</span>
                        </div>
                        <p class="comment-text">${comment.comment_text}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    container.innerHTML = detailHtml;
}
