import response from "../utils/response.js";
import { resStatusCode, resMessage } from "../utils/constants.js";
import { analyticsService } from "../services/analyticsService.js";

// const getEventStats = async (req, res) => {
export const getEventStats = async (req, res) => {

    try {
        const events = await analyticsService.fetchEventReport();
        // const fetchTopNewsViews = await analyticsService.fetchTopNewsViews();
        // res.json(events, fetchTopNewsViews);
        return response.success(res, resStatusCode.ACTION_COMPLETE, resMessage.BLOG_ADD, { events });

    } catch (error) {
        console.error("GA4 fetch error:", error.message);
        res.status(500).json({ error: "Failed to fetch GA4 data" });
    }
};

// module.exports = { getEventStats };
