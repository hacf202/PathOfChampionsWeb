import express from "express";
import cors from "cors";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
	DynamoDBDocumentClient,
	ScanCommand,
	BatchWriteCommand,
} from "@aws-sdk/lib-dynamodb";

const app = express();
const PORT = 3001;

// Cấu hình DynamoDB
const client = new DynamoDBClient({ region: "us-east-1" }); // Sửa vùng thành us-east-1
const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = "Builds";

// Middleware
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// Endpoint tải builds
app.get("/api/load-builds", async (req, res) => {
	try {
		const command = new ScanCommand({ TableName: TABLE_NAME });
		const { Items } = await docClient.send(command);
		console.log("Đã tải builds:", Items);
		res.json(Items || []);
	} catch (error) {
		console.error("Lỗi tải builds:", error);
		res.status(500).json({ error: error.message || "Không thể tải builds" });
	}
});

// Endpoint lưu builds
app.post("/api/save-builds", async (req, res) => {
	try {
		const builds = req.body;
		console.log("Nhận builds:", builds);

		// Kiểm tra dữ liệu
		if (
			!Array.isArray(builds) ||
			builds.some(build => !build.id || typeof build.id !== "string")
		) {
			throw new Error(
				"Dữ liệu không hợp lệ: Builds phải là mảng với ID dạng chuỗi"
			);
		}

		// Xóa dữ liệu cũ (tùy chọn, bỏ nếu muốn thêm mà không xóa)
		const scanCommand = new ScanCommand({ TableName: TABLE_NAME });
		const { Items } = await docClient.send(scanCommand);
		if (Items && Items.length > 0) {
			const deleteRequests = Items.map(item => ({
				DeleteRequest: { Key: { id: item.id } },
			}));
			const batchDeleteCommand = new BatchWriteCommand({
				RequestItems: { [TABLE_NAME]: deleteRequests },
			});
			await docClient.send(batchDeleteCommand);
			console.log("Đã xóa builds cũ");
		}

		// Đẩy builds mới
		const putRequests = builds.map(build => ({
			PutRequest: { Item: build },
		}));
		const batchWriteCommand = new BatchWriteCommand({
			RequestItems: { [TABLE_NAME]: putRequests },
		});
		await docClient.send(batchWriteCommand);
		console.log("Đã đẩy builds thành công");

		res.json({ message: "Đã lưu builds thành công" });
	} catch (error) {
		console.error("Lỗi lưu builds:", error);
		res.status(500).json({ error: error.message || "Không thể lưu builds" });
	}
});

app.listen(PORT, () => {
	console.log(`Server chạy tại http://localhost:${PORT}`);
});
