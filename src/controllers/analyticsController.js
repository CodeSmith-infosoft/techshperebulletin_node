import response from "../utils/response.js";
import { resStatusCode, resMessage } from "../utils/constants.js";
import { analyticsService } from "../services/analyticsService.js";

export const getEventStats = async (req, res) => {
    const { startDate, endDate } = req.query;
    try {
        console.log('startDate',startDate)
        const events = await analyticsService.fetchEventReport(startDate, endDate);
        const topFiveNews = events.news.sort((a, b) => Number(b.count) - Number(a.count)).slice(0, 5);

        const topFiveNewsIds = topFiveNews.map(item => item.event);
        const topNewsFromDB = await analyticsService.topNews(topFiveNewsIds);

        const topNewsWithCount = topNewsFromDB.map(newsItem => {
            const found = topFiveNews.find(n => n.event === String(newsItem._id));
            return {
                ...newsItem.toObject(),
                count: found ? Number(found.count) : 0
            };
        });
        return response.success(res, resStatusCode.ACTION_COMPLETE, resMessage.ACTION_COMPLETE, { events, topNews: topNewsWithCount });
    } catch (error) {
        console.error("GA4 fetch error:", error.message);
        return response.error(res, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR);
    };
};