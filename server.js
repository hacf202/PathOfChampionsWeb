import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
	DynamoDBDocumentClient,
	ScanCommand,
	BatchWriteCommand,
} from "@aws-sdk/lib-dynamodb";

// Khởi tạo biến môi trường
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Cấu hình DynamoDB
const client = new DynamoDBClient({
	region: process.env.AWS_REGION || "us-east-1",
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	},
});
const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = "Builds";

// Middleware
app.use(
	cors({
		origin: ["http://localhost:5173", "https://wpoc.vercel.app"],
		methods: ["GET", "POST"],
		allowedHeaders: ["Content-Type"],
	})
);
app.use(express.json());

// API kiểm tra trạng thái server
app.get("/api/checkhealth", (req, res) => {
	try {
		res
			.status(200)
			.json({ status: "healthy", timestamp: new Date().toISOString() });
	} catch (error) {
		console.error("Lỗi checkhealth:", error);
		res.status(500).json({ status: "unhealthy", error: error.message });
	}
});

// API tải builds
app.get("/api/load-builds", async (req, res) => {
	try {
		const command = new ScanCommand({ TableName: TABLE_NAME });
		const { Items } = await docClient.send(command);
		console.log("Đã tải builds:", Items?.length || 0, "items");
		res.status(200).json(Items || []);
	} catch (error) {
		console.error("Lỗi tải builds:", error);
		res.status(500).json({ error: error.message || "Không thể tải builds" });
	}
});

// API lưu builds
app.post("/api/save-builds", async (req, res) => {
	try {
		const builds = req.body;
		console.log("Nhận builds:", builds?.length || 0, "items");

		// Kiểm tra dữ liệu
		if (
			!Array.isArray(builds) ||
			builds.some(build => !build.id || typeof build.id !== "string")
		) {
			throw new Error(
				"Dữ liệu không hợp lệ: Builds phải là mảng với ID dạng chuỗi"
			);
		}

		// Xóa dữ liệu cũ
		const scanCommand = new ScanCommand({ TableName: TABLE_NAME });
		const { Items } = await docClient.send(scanCommand);
		if (Items && Items.length > 0) {
			const deleteRequests = Items.map(item => ({
				DeleteRequest: { Key: { id: item.id } },
			}));
			const chunks = chunkArray(deleteRequests, 25);
			for (const chunk of chunks) {
				const batchDeleteCommand = new BatchWriteCommand({
					RequestItems: { [TABLE_NAME]: chunk },
				});
				await docClient.send(batchDeleteCommand);
			}
			console.log("Đã xóa", Items.length, "builds cũ");
		}

		// Đẩy builds mới
		const putRequests = builds.map(build => ({
			PutRequest: { Item: build },
		}));
		const chunks = chunkArray(putRequests, 25);
		for (const chunk of chunks) {
			const batchWriteCommand = new BatchWriteCommand({
				RequestItems: { [TABLE_NAME]: chunk },
			});
			await docClient.send(batchWriteCommand);
		}
		console.log("Đã đẩy", builds.length, "builds thành công");

		res.status(201).json({ message: "Đã lưu builds thành công" });
	} catch (error) {
		console.error("Lỗi lưu builds:", error);
		res.status(500).json({ error: error.message || "Không thể lưu builds" });
	}
});

// Hàm chia mảng thành các chunk
const chunkArray = (array, size) => {
	const results = [];
	for (let i = 0; i < array.length; i += size) {
		results.push(array.slice(i, i + size));
	}
	return results;
};

// Khởi động server
app.listen(PORT, () => {
	console.log(`Server chạy tại https://wpoc.vercel.app`);
});
