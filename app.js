const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const cors = require("cors");  // นำเข้า cors
const app = express();

app.use(cors());  // ใช้ CORS middleware

app.use(express.json());
let db;
const client = new MongoClient("mongodb://localhost:27017");

client.connect().then(() => {
    db = client.db("ecommerce");  // สามารถเปลี่ยนเป็น "school" หรือชื่อฐานข้อมูลที่ต้องการได้
    console.log("MongoDB connected");
}).catch((err) => {
    console.log("MongoDB unconnect");
});

// ดึงข้อมูลทั้งหมด (student)
app.get('/student', async (req, res) => {
    try {
        const students = await db.collection("student").find().toArray();  // เปลี่ยนเป็น collection "student"
        res.json(students);
    } catch (err) {
        res.json({ error: "Error fetching students" });
    }
});

// ค้นหานักศึกษาโดยใช้รหัสนักศึกษา
app.get('/student/:studentId', async (req, res) => {
    try {
        const studentId = req.params.studentId;
        const student = await db.collection("student").findOne({
            "studentId": studentId  // ค้นหาด้วย studentId
        });
        if (student) {
            res.json(student);
        } else {
            res.status(404).json({ error: "Student not found" });
        }
    } catch (err) {
        res.json({ error: "Error fetching student" });
    }
});

// เพิ่มข้อมูลนักศึกษาใหม่
app.post('/student', async (req, res) => {
    try {
        const { studentId, name } = req.body;  // ค่าที่จะรับมาจากฟอร์ม
        const newStudent = { studentId, name };
        const result = await db.collection("student").insertOne(newStudent);
        res.json(result);
    } catch (err) {
        res.json({ error: "Error adding student" });
    }
});

// แก้ไขข้อมูลนักศึกษาตามรหัส
app.put('/student/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { name } = req.body;  // รับค่าชื่อใหม่จาก body
        const result = await db.collection("student").updateOne(
            { "_id": new ObjectId(id) },
            { $set: { name } }  // แก้ไขแค่ชื่อ
        );
        res.json(result);
    } catch (err) {
        res.json({ error: "Error updating student" });
    }
});

// ลบข้อมูลนักศึกษา
app.delete('/student/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const result = await db.collection("student").deleteOne({ "_id": new ObjectId(id) });
        res.json(result);
    } catch (err) {
        res.json({ error: "Error deleting student" });
    }
});

app.listen(3000, () => {
    console.log('Server started: success');
});
