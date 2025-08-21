import { BetaAnalyticsDataClient } from "@google-analytics/data";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import dotenv from 'dotenv';
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const analyticsDataClient = new BetaAnalyticsDataClient({
    keyFilename: path.join(__dirname, "../../config/mailer/ga-credentials.json"),
});

const GA4_PROPERTY_ID = process.env.GA4_PROPERTY_ID;
export class analyticsService {
    static async fetchEventReport() {
        try {
            const [response] = await analyticsDataClient.runReport({
                property: `properties/${GA4_PROPERTY_ID}`,
                dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
                dimensions: [{ name: "pagePath" }],
                metrics: [{ name: "screenPageViews" }],
            });

            return response.rows.map((row) => ({
                event: row.dimensionValues[0].value,
                count: row.metricValues[0].value,
            }));
        } catch (error) {
            return error;
        }
    }

    static async fetchTopNewsViews() {
        try {
            const [response] = await analyticsDataClient.runReport({
                property: `properties/${GA4_PROPERTY_ID}`,
                dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
                dimensions: [{ name: "pagePath" }],
                metrics: [{ name: "screenPageViews" }],
                orderBys: [
                    {
                        metric: {
                            metricName: "screenPageViews",
                        },
                        desc: true,
                    },
                ],
                limit: 100,
            });

            const newsData = [];

            response.rows.forEach((row) => {
                const pagePath = row.dimensionValues[0].value;
                const pageViews = row.metricValues[0].value;

                const match = pagePath.match(/^\/detail\/([a-zA-Z0-9]+)$/);
                if (match) {
                    newsData.push({
                        newsId: match[1],
                        views: Number(pageViews),
                    });
                }
            });
            const top5NewsIds = newsData
                .sort((a, b) => b.views - a.views)
                .slice(0, 5)
                .map((item) => item.newsId);
            return top5NewsIds;
        } catch (error) {
            console.error("GA4 Error:", error);
            return [];
        }
    }
}