require("dotenv").config();


const express = require("express");
const cors = require("cors");
const multer = require("multer");

const {
  S3Client,
  PutObjectCommand,
} = require("@aws-sdk/client-s3");

const app = express();

app.use(
  cors({
    origin: "https://cloud-file-storage-system-rose.vercel.app",
    methods: ["GET", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);
app.use(express.json());

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Test backend
app.get("/", (req, res) => {
  res.json({
    message: "Cloud File Storage Backend is running!",
  });
});

// Test S3 configuration
app.get("/test-s3", (req, res) => {
  res.json({
    message: "S3 client configured successfully!",
    bucket: process.env.AWS_S3_BUCKET_NAME,
    region: process.env.AWS_REGION,
  });
});

// Upload file to S3
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Please select a file.",
      });
    }

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: `${Date.now()}-${req.file.originalname}`,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    });

    await s3.send(command);

    res.json({
      message: "File uploaded successfully!",
      fileName: req.file.originalname,
    });
  } catch (error) {
    console.error("Upload error:", error);

    res.status(500).json({
      message: "File upload failed.",
    });
  }
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend server running on port ${PORT}`);
});