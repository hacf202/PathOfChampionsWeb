import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import {
	DynamoDBClient,
	UpdateItemCommand,
	PutItemCommand,
	DeleteItemCommand,
} from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

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
		methods: ["GET", "POST", "PUT", "DELETE"],
		allowedHeaders: ["Content-Type"],
	})
);
app.use(express.json());

// Hàm chuyển đổi từ định dạng DynamoDB sang JavaScript object
const convertFromDynamoDB = item => {
	const result = {};
	for (const [key, value] of Object.entries(item)) {
		if ("S" in value) {
			result[key] = value.S;
		} else if ("L" in value) {
			result[key] = value.L.map(v => (v.S ? v.S : v));
		} else {
			result[key] = value;
		}
	}
	return result;
};

// API kiểm tra trạng thái server
app.get("/api/checkhealth", (req, res) => {
	try {
		const timestamp = new Date().toISOString();
		console.log(`[${timestamp}] Kiểm tra trạng thái server: Thành công`);
		res.status(200).json({ status: "healthy", timestamp });
	} catch (error) {
		const timestamp = new Date().toISOString();
		console.error(`[${timestamp}] Lỗi checkhealth:`, error.message);
		res.status(500).json({ status: "unhealthy", error: error.message });
	}
});

// API tải builds
app.get("/api/load-builds", async (req, res) => {
	try {
		const timestamp = new Date().toISOString();
		console.log(`[${timestamp}] Bắt đầu tải builds từ bảng ${TABLE_NAME}`);
		const command = new ScanCommand({ TableName: TABLE_NAME });
		const { Items } = await docClient.send(command);
		console.log(`[${timestamp}] Đã tải ${Items?.length || 0} builds`);
		res.status(200).json(Items || []);
	} catch (error) {
		const timestamp = new Date().toISOString();
		console.error(`[${timestamp}] Lỗi tải builds:`, error.message);
		res.status(500).json({ error: error.message || "Không thể tải builds" });
	}
});

// API thêm build
app.post("/api/add-builds", async (req, res) => {
	try {
		const timestamp = new Date().toISOString();
		const build = req.body;
		console.log(`[${timestamp}] Nhận yêu cầu thêm build`, { build });

		// Kiểm tra dữ liệu
		if (
			!build ||
			typeof build !== "object" ||
			!build.id ||
			!build.id.S ||
			typeof build.id.S !== "string"
		) {
			const errorMsg =
				"Dữ liệu không hợp lệ: Build phải là object với id.S dạng chuỗi";
			console.error(`[${timestamp}] ${errorMsg}`, { build });
			return res.status(400).json({ error: errorMsg });
		}

		// Thêm build mới
		const putCommand = new PutItemCommand({
			TableName: TABLE_NAME,
			Item: build,
		});
		await docClient.send(putCommand);
		console.log(`[${timestamp}] Đã thêm build với ID: ${build.id.S}`);

		res.status(201).json({ message: "Đã thêm build thành công" });
	} catch (error) {
		const timestamp = new Date().toISOString();
		console.error(`[${timestamp}] Lỗi thêm build:`, error.message, { build });
		res.status(500).json({ error: error.message || "Không thể thêm build" });
	}
});

// API cập nhật build
app.put("/api/update-builds", async (req, res) => {
	try {
		const timestamp = new Date().toISOString();
		const build = req.body;
		console.log(`[${timestamp}] Nhận yêu cầu cập nhật build`, { build });

		// Kiểm tra dữ liệu
		if (
			!build ||
			typeof build !== "object" ||
			!build.id ||
			!build.id.S ||
			typeof build.id.S !== "string"
		) {
			const errorMsg =
				"Dữ liệu không hợp lệ: Build phải là object với id.S dạng chuỗi";
			console.error(`[${timestamp}] ${errorMsg}`, { build });
			return res.status(400).json({ error: errorMsg });
		}

		// Tạo UpdateExpression động
		const updateExpression = [];
		const expressionAttributeValues = {};
		const expressionAttributeNames = {};

		for (const [key, value] of Object.entries(build)) {
			if (key !== "id") {
				updateExpression.push(`#${key} = :${key}`);
				expressionAttributeNames[`#${key}`] = key;
				expressionAttributeValues[`:${key}`] = value; // Giữ nguyên định dạng DynamoDB
			}
		}

		if (updateExpression.length === 0) {
			const errorMsg = "Không có thuộc tính nào để cập nhật";
			console.error(`[${timestamp}] ${errorMsg}`, { build });
			return res.status(400).json({ error: errorMsg });
		}

		console.log(`[${timestamp}] Chuẩn bị cập nhật build ID: ${build.id.S}`, {
			attributes: Object.keys(expressionAttributeNames),
		});

		const command = new UpdateItemCommand({
			TableName: TABLE_NAME,
			Key: { id: { S: build.id.S } },
			UpdateExpression: `SET ${updateExpression.join(", ")}`,
			ExpressionAttributeNames: expressionAttributeNames,
			ExpressionAttributeValues: expressionAttributeValues,
			ConditionExpression: "attribute_exists(id)",
		});

		await client.send(command);
		console.log(`[${timestamp}] Đã cập nhật build với ID: ${build.id.S}`);

		res.status(200).json({ message: "Đã cập nhật build thành công" });
	} catch (error) {
		const timestamp = new Date().toISOString();
		console.error(
			`[${timestamp}] Lỗi cập nhật build ID: ${
				build?.id?.S || "không xác định"
			}`,
			error.message,
			{ build }
		);
		res
			.status(500)
			.json({ error: error.message || "Không thể cập nhật build" });
	}
});

// API xóa build
app.delete("/api/delete-builds", async (req, res) => {
	try {
		const timestamp = new Date().toISOString();
		const build = req.body;
		console.log(`[${timestamp}] Nhận yêu cầu xóa build`, { build });

		// Kiểm tra dữ liệu
		if (
			!build ||
			typeof build !== "object" ||
			!build.id ||
			!build.id.S ||
			typeof build.id.S !== "string"
		) {
			const errorMsg =
				"Dữ liệu không hợp lệ: Build phải là object với id.S dạng chuỗi";
			console.error(`[${timestamp}] ${errorMsg}`, { build });
			return res.status(400).json({ error: errorMsg });
		}

		// Xóa build
		const deleteCommand = new DeleteItemCommand({
			TableName: TABLE_NAME,
			Key: { id: { S: build.id.S } },
		});
		await docClient.send(deleteCommand);
		console.log(`[${timestamp}] Đã xóa build với ID: ${build.id.S}`);

		res.status(200).json({ message: "Đã xóa build thành công" });
	} catch (error) {
		const timestamp = new Date().toISOString();
		console.error(`[${timestamp}] Lỗi xóa build:`, error.message, { build });
		res.status(500).json({ error: error.message || "Không thể xóa build" });
	}
});

// API lưu build
app.post("/api/save-builds", async (req, res) => {
	try {
		const timestamp = new Date().toISOString();
		const build = req.body;
		console.log(`[${timestamp}] Nhận yêu cầu lưu build`, { build });

		// Kiểm tra dữ liệu
		if (
			!build ||
			typeof build !== "object" ||
			!build.id ||
			!build.id.S ||
			typeof build.id.S !== "string"
		) {
			const errorMsg =
				"Dữ liệu không hợp lệ: Build phải là object với id.S dạng chuỗi";
			console.error(`[${timestamp}] ${errorMsg}`, { build });
			return res.status(400).json({ error: errorMsg });
		}

		// Lưu build (thay thế nếu đã tồn tại)
		const putCommand = new PutItemCommand({
			TableName: TABLE_NAME,
			Item: build,
		});
		await docClient.send(putCommand);
		console.log(`[${timestamp}] Đã lưu build với ID: ${build.id.S}`);

		res.status(201).json({ message: "Đã lưu build thành công" });
	} catch (error) {
		const timestamp = new Date().toISOString();
		console.error(`[${timestamp}] Lỗi lưu build:`, error.message, { build });
		res.status(500).json({ error: error.message || "Không thể lưu build" });
	}
});

// Khởi động server với xử lý lỗi
app.listen(PORT, err => {
	const timestamp = new Date().toISOString();
	if (err) {
		console.error(
			`[${timestamp}] Lỗi khởi động server trên cổng ${PORT}:`,
			err.message
		);
		process.exit(1);
	}
	console.log(`[${timestamp}] Server chạy tại http://localhost:${PORT}`);
	console.log(`[${timestamp}] Server chạy tại https://pocweb.onrender.com`);
});
