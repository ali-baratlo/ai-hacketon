document.addEventListener('DOMContentLoaded', () => {
    const dashboard = document.getElementById('dashboard');

    if (!restaurantData) {
        dashboard.innerHTML = '<p>اطلاعاتی برای نمایش وجود ندارد.</p>';
        return;
    }

    restaurantData.forEach(data => {
        const card = document.createElement('div');
        card.className = 'restaurant-card';
        card.innerHTML = `
            <div class="restaurant-header">
                <img src="https://picsum.photos/seed/${data.restaurant_id}/100" alt="Restaurant Photo" class="restaurant-photo">
                <div class="restaurant-title">
                    <h2>${data.restaurant_name}</h2>
                    <span class="health-score">امتیاز سلامت: ${data.health_score}/100</span>
                </div>
            </div>
            <div class="card-content">
                <!-- Sentiment Summary -->
                <div class="analysis-section sentiment-summary">
                    <h3>خلاصه احساسات</h3>
                    <div class="sentiment-item positive">
                        <span>مثبت (${data.sentiment_summary.positive_count})</span>
                        <span>${data.sentiment_summary.positive_percent}%</span>
                    </div>
                    <div class="progress-bar"><div class="progress" style="width: ${data.sentiment_summary.positive_percent}%"></div></div>
                    <div class="sentiment-item negative">
                        <span>منفی (${data.sentiment_summary.negative_count})</span>
                        <span>${data.sentiment_summary.negative_percent}%</span>
                    </div>
                    <div class="progress-bar"><div class="progress" style="width: ${data.sentiment_summary.negative_percent}%"></div></div>
                    <div class="sentiment-item neutral">
                        <span>خنثی (${data.sentiment_summary.neutral_count})</span>
                        <span>${data.sentiment_summary.neutral_percent}%</span>
                    </div>
                    <div class="progress-bar"><div class="progress" style="width: ${data.sentiment_summary.neutral_percent}%"></div></div>
                </div>

                <!-- Aspect-Based Sentiment -->
                <div class="analysis-section aspect-sentiment">
                    <h3>امتیاز جنبه‌ها</h3>
                    ${Object.entries(data.aspect_based_sentiment).map(([aspect, score]) => `
                        <div class="aspect-item">
                            <span>${translateAspect(aspect)}</span>
                            <div class="score-bar">
                                <div class="score-marker" style="right: ${score * 100}%"></div>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <!-- Top Themes -->
                <div class="analysis-section top-themes">
                    <h3>موضوعات اصلی</h3>
                    <h4>مثبت</h4>
                    <ul>
                        ${data.top_themes.top_positive_themes.map(theme => `<li class="positive-theme">${theme}</li>`).join('') || '<li>موضوعی یافت نشد</li>'}
                    </ul>
                    <h4>منفی</h4>
                    <ul>
                        ${data.top_themes.top_negative_themes.map(theme => `<li class="negative-theme">${theme}</li>`).join('') || '<li>موضوعی یافت نشد</li>'}
                    </ul>
                </div>

                <!-- Time Trends -->
                <div class="analysis-section">
                    <h3>روند زمانی نظرات</h3>
                    <canvas id="time-trends-chart-${data.restaurant_id}"></canvas>
                </div>

                <!-- Alerts -->
                <div class="analysis-section alerts">
                    <h3>🚨 هشدارها</h3>
                    <ul>
                        ${data.alerts.length ? data.alerts.map(alert => `<li>${alert.message}</li>`).join('') : '<li>هشداری وجود ندارد</li>'}
                    </ul>
                </div>

                <!-- AI Summary -->
                <div class="analysis-section ai-summary">
                    <h3>خلاصه هوش مصنوعی</h3>
                    <p>${data.ai_summary}</p>
                </div>

                <!-- Word Cloud -->
                <div class="analysis-section">
                    <h3>ابر کلمات</h3>
                    <div id="word-cloud-${data.restaurant_id}" style="width: 100%; height: 250px;"></div>
                </div>
            </div>
        `;
        dashboard.appendChild(card);

        // Render charts
        renderTimeTrendsChart(data.time_trends, data.restaurant_id);
        renderWordCloud(data.word_cloud_data, data.restaurant_id);
    });
});

function translateAspect(aspect) {
    const translations = {
        "taste": "طعم",
        "delivery": "تحویل",
        "packaging": "بسته‌بندی",
        "price": "قیمت",
        "portion": "حجم",
        "service": "سرویس"
    };
    return translations[aspect] || aspect;
}

function renderTimeTrendsChart(trends, restaurantId) {
    const ctx = document.getElementById(`time-trends-chart-${restaurantId}`).getContext('2d');
    const labels = trends.map(t => t.date);
    const positiveData = trends.map(t => t.positive);
    const negativeData = trends.map(t => t.negative);

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'نظرات مثبت',
                    data: positiveData,
                    borderColor: '#2ecc71',
                    backgroundColor: 'rgba(46, 204, 113, 0.1)',
                    fill: true,
                    tension: 0.3
                },
                {
                    label: 'نظرات منفی',
                    data: negativeData,
                    borderColor: '#e74c3c',
                    backgroundColor: 'rgba(231, 76, 60, 0.1)',
                    fill: true,
                    tension: 0.3
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                x: { display: true, title: { display: true, text: 'تاریخ' } },
                y: { display: true, title: { display: true, text: 'تعداد نظرات' }, beginAtZero: true }
            },
            plugins: { legend: { position: 'top' } }
        }
    });
}

function renderWordCloud(wordData, restaurantId) {
    const canvas = document.getElementById(`word-cloud-${restaurantId}`);
    const list = wordData.map(item => [item.word, item.count * 2]); // Multiply count to make words bigger

    WordCloud(canvas, {
        list: list,
        gridSize: 8,
        weightFactor: 4,
        fontFamily: 'Vazirmatn, sans-serif',
        color: 'random-dark',
        backgroundColor: '#f7f9fc'
    });
}
