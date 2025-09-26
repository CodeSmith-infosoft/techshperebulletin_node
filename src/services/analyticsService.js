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

import { newsModel } from "../models/newsModel.js";
import { CLIENT_RENEG_LIMIT } from "tls";

const GA4_PROPERTY_ID = process.env.GA4_PROPERTY_ID;
export class analyticsService {

    // static async fetchEventReport(startDate, endDate) {
    //     try {
    //         const [response] = await analyticsDataClient.runReport({
    //             property: `properties/${GA4_PROPERTY_ID}`,
    //             dateRanges: [{ startDate: startDate ?? "30daysAgo", endDate: endDate ?? "today" }],
    //             dimensions: [{ name: "pagePath" }],
    //             metrics: [{ name: "screenPageViews" }],
    //         });

    //         if (!response.rows || response.rows.length === 0) {
    //             return { news: [], blog: [], others: [] };
    //         };

    //         const news = [];
    //         const blog = [];
    //         const others = [];

    //         response.rows.forEach((row) => {
    //             const eventPath = row.dimensionValues?.[0]?.value || "";
    //             const count = row.metricValues?.[0]?.value || "0";

    //             if (eventPath.startsWith("/detail/")) {
    //                 const id = eventPath.replace("/detail/", "");
    //                 news.push({ event: id, count });
    //             } else if (eventPath.startsWith("/blog/")) {
    //                 blog.push({ event: eventPath, count });
    //             } else {
    //                 others.push({ event: eventPath, count });
    //             };
    //         });

    //         return { news, blog, others };
    //     } catch (error) {
    //         console.error("Error fetching event report:", error);
    //         return { news: [], blog: [], others: [] };
    //     };
    // };

    static async fetchEventReport(startDate, endDate) {
    try {
        // ✅ First call: Page Paths
        const [pageResponse] = await analyticsDataClient.runReport({
            property: `properties/${GA4_PROPERTY_ID}`,
            dateRanges: [{ startDate: startDate ?? "30daysAgo", endDate: endDate ?? "today" }],
            dimensions: [{ name: "pagePath" }],
            metrics: [{ name: "screenPageViews" }]
        });

        const news = [];
        const blog = [];
        const others = [];

        if (pageResponse.rows && pageResponse.rows.length > 0) {
            pageResponse.rows.forEach((row) => {
                const eventPath = row.dimensionValues?.[0]?.value || "";
                const count = row.metricValues?.[0]?.value || "0";

                if (eventPath.startsWith("/detail/")) {
                    news.push({ event: eventPath.replace("/detail/", ""), count });
                } else if (eventPath.startsWith("/blog/")) {
                    blog.push({ event: eventPath, count });
                } else {
                    others.push({ event: eventPath, count });
                }
            });
        }
console.log('startDate', startDate)
        // ✅ Second call: Top Countries
        const [countryResponse] = await analyticsDataClient.runReport({
            property: `properties/${GA4_PROPERTY_ID}`,
            dateRanges: [{ startDate: startDate ?? "30daysAgo", endDate: endDate ?? "today" }],
            dimensions: [{ name: "country" }],
            metrics: [{ name: "screenPageViews" }],
            orderBys: [{ desc: true, metric: { metricName: "screenPageViews" } }],
            limit: 5
        });

        const countries = (countryResponse.rows || []).map(row => ({
            country: row.dimensionValues[0].value,
            count: Number(row.metricValues[0].value)
        }));

        return { news, blog, others, countries };

    } catch (error) {
        console.error("Error fetching event report:", error);
        return { news: [], blog: [], others: [], countries: [] };
    }
}

    static async topNews(data) {
        try {
            const topNewsDetails = await newsModel.find({ _id: { $in: data } }).select('_id title mainImage description createdAt');
            return (topNewsDetails);
        } catch (error) {
            return (error);
        };
    };

};