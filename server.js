import express from "express";
import cors from "cors";
import {
	DynamoDBClient,
	ScanCommand,
	GetItemCommand,
	PutItemCommand,
	UpdateItemCommand,
	DeleteItemCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

const app = express();
const port = process.env.PORT || 3000;

// Cấu hình AWS DynamoDB Client
const client = new DynamoDBClient({
	region: "us-east-1", // Thay bằng region của bạn
});

// Tên bảng DynamoDB
const TABLE_NAME = "Builds"; // Thay bằng tên bảng của bạn

// Middleware
app.use(cors({ origin: "https://wpoc.vercel.app/" }));
// app.use(cors({ origin: "http://locahost:5173" })); // Cho phép origin từ frontend
app.use(express.json());

// Health check endpoint
app.get("/api/checkheal", async (req, res) => {
	try {
		const command = new ScanCommand({
			TableName: TABLE_NAME,
			Limit: 1,
		});
		await client.send(command);
		res.status(200).json({
			status: "healthy",
			message: "Server và DynamoDB đang hoạt động bình thường",
			timestamp: new Date().toISOString(),
		});
	} catch (error) {
		console.error("Health check error:", error);
		res.status(500).json({
			status: "unhealthy",
			message: "Lỗi khi kết nối đến DynamoDB",
			error: error.message,
		});
	}
});

// Load toàn bộ builds
app.get("/api/builds", async (req, res) => {
	try {
		const command = new ScanCommand({ TableName: TABLE_NAME });
		const response = await client.send(command);
		const items = response.Items.map(item => unmarshall(item));
		res.json(items);
	} catch (error) {
		console.error("Error:", error);
		res.status(500).json({ error: "Không thể lấy danh sách builds" });
	}
});

// Tải xuống toàn bộ builds dưới dạng file JSON
app.get("/api/builds/download", async (req, res) => {
	try {
		const command = new ScanCommand({ TableName: TABLE_NAME });
		const response = await client.send(command);
		const items = response.Items.map(item => unmarshall(item));

		// Thiết lập header để tải file
		res.setHeader("Content-Disposition", "attachment; filename=builds.json");
		res.setHeader("Content-Type", "application/json");
		res.send(JSON.stringify(items, null, 2));
	} catch (error) {
		console.error("Error:", error);
		res.status(500).json({ error: "Không thể tải xuống builds" });
	}
});

// Thêm một build mới
app.post("/api/builds", async (req, res) => {
	const { id, championName, creator, description, artifacts, items, powers } =
		req.body;
	const build = {
		id: { S: id },
		championName: { S: championName },
		creator: { S: creator },
		description: { S: description },
		artifacts: { L: artifacts.map(a => ({ S: a })) },
		items: { L: items.map(i => ({ S: i })) },
		powers: { L: powers.map(p => ({ S: p })) },
	};
	try {
		const command = new PutItemCommand({
			TableName: TABLE_NAME,
			Item: build,
		});
		await client.send(command);
		res
			.status(201)
			.json({ message: "Build đã được tạo", build: unmarshall(build) });
	} catch (error) {
		console.error("Error:", error);
		res.status(500).json({ error: "Không thể tạo build" });
	}
});

// Sửa một build
app.put("/api/builds/:id", async (req, res) => {
	const { id } = req.params;
	const { championName, creator, description, artifacts, items, powers } =
		req.body;
	try {
		const command = new UpdateItemCommand({
			TableName: TABLE_NAME,
			Key: marshall({ id }),
			UpdateExpression:
				"SET championName = :c, creator = :cr, description = :d, artifacts = :a, items = :i, powers = :p",
			ExpressionAttributeValues: marshall({
				":c": championName,
				":cr": creator,
				":d": description,
				":a": artifacts.map(a => ({ S: a })),
				":i": items.map(i => ({ S: i })),
				":p": powers.map(p => ({ S: p })),
			}),
			ReturnValues: "ALL_NEW",
		});
		const response = await client.send(command);
		const updatedItem = unmarshall(response.Attributes);
		res.json({ message: "Build đã được cập nhật", build: updatedItem });
	} catch (error) {
		console.error("Error:", error);
		res.status(500).json({ error: "Không thể cập nhật build" });
	}
});

// Xóa một build
app.delete("/api/builds/:id", async (req, res) => {
	const { id } = req.params;
	try {
		const command = new DeleteItemCommand({
			TableName: TABLE_NAME,
			Key: marshall({ id }),
		});
		await client.send(command);
		res.json({ message: "Build đã được xóa" });
	} catch (error) {
		console.error("Error:", error);
		res.status(500).json({ error: "Không thể xóa build" });
	}
});

// Khởi động server
app.listen(port, () => {
	console.log(`Server đang chạy tại http://localhost:${port}`);
	console.log(`Server đang chạy tại https://pocweb.onrender.com`);
});
