import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import {
	DynamoDBClient,
	PutItemCommand,
	UpdateItemCommand,
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

// Hàm chuẩn hóa dữ liệu build theo định dạng Builds.jsx
const standardizeBuildData = build => {
	return {
		id: build.id || "",
		championName: build.championName || "",
		artifacts: Array.isArray(build.artifacts)
			? [...build.artifacts.slice(0, 3), "", "", ""].slice(0, 3)
			: ["", "", ""],
		items: Array.isArray(build.items)
			? [...build.items.slice(0, 6), "", "", "", "", "", ""].slice(0, 6)
			: ["", "", "", "", "", ""],
		powers: Array.isArray(build.powers)
			? [...build.powers.slice(0, 6), "", "", "", "", "", ""].slice(0, 6)
			: ["", "", "", "", "", ""],
		description: build.description || "",
		creator: build.creator || "",
	};
};

// Hàm chuyển đổi từ JavaScript object sang định dạng DynamoDB
const convertToDynamoDB = data => {
	const result = {};
	for (const [key, value] of Object.entries(data)) {
		if (Array.isArray(value)) {
			result[key] = { L: value.map(item => ({ S: String(item) })) };
		} else if (typeof value === "string") {
			result[key] = { S: value };
		} else {
			result[key] = value; // Giữ nguyên các kiểu dữ liệu khác
		}
	}
	return result;
};

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
	return standardizeBuildData(result); // Chuẩn hóa sau khi chuyển đổi
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
		res
			.status(500)
			.json({ error: error.message || "Lỗi kiểm tra trạng thái server" });
	}
});

// API tải builds
app.get("/api/load-builds", async (req, res) => {
	try {
		const timestamp = new Date().toISOString();
		console.log(`[${timestamp}] Bắt đầu tải builds từ bảng ${TABLE_NAME}`);
		const command = new ScanCommand({ TableName: TABLE_NAME });
		const response = await docClient.send(command);
		const convertedItems = response.Items
			? response.Items.map(convertFromDynamoDB)
			: [];
		console.log(`[${timestamp}] Đã tải ${convertedItems.length} builds`);
		res.status(200).json(convertedItems);
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
		const build = standardizeBuildData(req.body);
		console.log(`[${timestamp}] Nhận yêu cầu thêm build`, { build });

		// Kiểm tra dữ liệu
		if (
			!build ||
			typeof build !== "object" ||
			!build.id ||
			typeof build.id !== "string" ||
			!build.championName ||
			!build.artifacts.some(artifact => artifact)
		) {
			const errorMsg =
				"Dữ liệu không hợp lệ: Build phải có id, championName và ít nhất một artifact";
			console.error(`[${timestamp}] ${errorMsg}`, { build });
			return res.status(400).json({ error: errorMsg });
		}

		// Chuyển đổi sang định dạng DynamoDB
		const dynamoItem = convertToDynamoDB(build);

		// Thêm build mới
		const putCommand = new PutItemCommand({
			TableName: TABLE_NAME,
			Item: dynamoItem,
		});
		await docClient.send(putCommand);
		console.log(`[${timestamp}] Đã thêm build với ID: ${build.id}`);

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
		const build = standardizeBuildData(req.body);
		console.log(`[${timestamp}] Nhận yêu cầu cập nhật build`, { build });

		// Kiểm tra dữ liệu
		if (
			!build ||
			typeof build !== "object" ||
			!build.id ||
			typeof build.id !== "string" ||
			!build.championName ||
			!build.artifacts.some(artifact => artifact)
		) {
			const errorMsg =
				"Dữ liệu không hợp lệ: Build phải có id, championName và ít nhất một artifact";
			console.error(`[${timestamp}] ${errorMsg}`, { build });
			return res.status(400).json({ error: errorMsg });
		}

		// Chuyển đổi sang định dạng DynamoDB
		const dynamoItem = convertToDynamoDB(build);

		// Tạo UpdateExpression động
		const updateExpression = [];
		const expressionAttributeValues = {};
		const expressionAttributeNames = {};

		for (const [key, value] of Object.entries(dynamoItem)) {
			if (key !== "id") {
				updateExpression.push(`#${key} = :${key}`);
				expressionAttributeNames[`#${key}`] = key;
				expressionAttributeValues[`:${key}`] = value;
			}
		}

		if (updateExpression.length === 0) {
			const errorMsg = "Không có thuộc tính nào để cập nhật";
			console.error(`[${timestamp}] ${errorMsg}`, { build });
			return res.status(400).json({ error: errorMsg });
		}

		console.log(`[${timestamp}] Chuẩn bị cập nhật build ID: ${build.id}`, {
			attributes: Object.keys(expressionAttributeNames),
		});

		const command = new UpdateItemCommand({
			TableName: TABLE_NAME,
			Key: { id: { S: build.id } },
			UpdateExpression: `SET ${updateExpression.join(", ")}`,
			ExpressionAttributeNames: expressionAttributeNames,
			ExpressionAttributeValues: expressionAttributeValues,
			ConditionExpression: "attribute_exists(id)",
		});

		await client.send(command);
		console.log(`[${timestamp}] Đã cập nhật build với ID: ${build.id}`);

		res.status(200).json({ message: "Đã cập nhật build thành công" });
	} catch (error) {
		const timestamp = new Date().toISOString();
		console.error(
			`[${timestamp}] Lỗi cập nhật build ID: ${build?.id || "không xác định"}`,
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
		const { id } = req.body;
		console.log(`[${timestamp}] Nhận yêu cầu xóa build`, { id });

		// Kiểm tra dữ liệu
		if (!id || typeof id !== "string") {
			const errorMsg = "Dữ liệu không hợp lệ: Yêu cầu id dạng chuỗi";
			console.error(`[${timestamp}] ${errorMsg}`, { id });
			return res.status(400).json({ error: errorMsg });
		}

		// Xóa build
		const deleteCommand = new DeleteItemCommand({
			TableName: TABLE_NAME,
			Key: { id: { S: id } },
		});
		await docClient.send(deleteCommand);
		console.log(`[${timestamp}] Đã xóa build với ID: ${id}`);

		res.status(200).json({ message: "Đã xóa build thành công" });
	} catch (error) {
		const timestamp = new Date().toISOString();
		console.error(`[${timestamp}] Lỗi xóa build:`, error.message, { id });
		res.status(500).json({ error: error.message || "Không thể xóa build" });
	}
});

// API lưu builds (xử lý mảng builds từ client)
app.post("/api/save-builds", async (req, res) => {
	try {
		const timestamp = new Date().toISOString();
		const builds = req.body;
		console.log(`[${timestamp}] Nhận yêu cầu lưu builds`, { builds });

		// Kiểm tra dữ liệu
		if (!Array.isArray(builds)) {
			const errorMsg = "Dữ liệu không hợp lệ: Yêu cầu một mảng builds";
			console.error(`[${timestamp}] ${errorMsg}`, { builds });
			return res.status(400).json({ error: errorMsg });
		}

		// Lưu từng build
		for (const build of builds) {
			const standardizedBuild = standardizeBuildData(build);
			if (
				!standardizedBuild ||
				typeof standardizedBuild !== "object" ||
				!standardizedBuild.id ||
				typeof standardizedBuild.id !== "string" ||
				!standardizedBuild.championName ||
				!standardizedBuild.artifacts.some(artifact => artifact)
			) {
				const errorMsg = `Build không hợp lệ: ${JSON.stringify(
					standardizedBuild
				)}`;
				console.error(`[${timestamp}] ${errorMsg}`);
				continue; // Bỏ qua build không hợp lệ
			}

			const dynamoItem = convertToDynamoDB(standardizedBuild);
			const putCommand = new PutItemCommand({
				TableName: TABLE_NAME,
				Item: dynamoItem,
			});
			await docClient.send(putCommand);
			console.log(
				`[${timestamp}] Đã lưu build với ID: ${standardizedBuild.id}`
			);
		}

		res.status(201).json({ message: "Đã lưu builds thành công" });
	} catch (error) {
		const timestamp = new Date().toISOString();
		console.error(`[${timestamp}] Lỗi lưu builds:`, error.message, { builds });
		res.status(500).json({ error: error.message || "Không thể lưu builds" });
	}
});

// Middleware xử lý lỗi toàn cục
app.use((err, req, res, next) => {
	const timestamp = new Date().toISOString();
	console.error(`[${timestamp}] Lỗi server:`, err.message);
	res.status(500).json({ error: err.message || "Lỗi server không xác định" });
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
