const fs = require("fs");
const crypto = require("crypto");
const axios = require("axios");

const API_KEY = "kI2OONewQw8uEWYG2xSkvWWy52LspXbLsTFm5vglvJz4GcNr";
const CONTENT_TYPE = "image/jpeg";
const OUTPUT_CONTENT_TYPE = "image/jpeg";
const TIMEOUT = 60000;
const BASE_URL = "https://developer.remini.ai/api";

module.exports.config = {
  name: "remini",
  version: "1.0.0",
  role: 0,
  hasPrefix: false,
  credits: "cliff",
  description: "Enhance photo",
  usages: "imgur reply image,png,jpg",
  cooldown: 0,
};

module.exports.run = async function ({ api, event, args }) {
  try {
    if (event.type !== "message_reply" || event.messageReply.attachments.length === 0) {
      return api.sendMessage("Please reply with the photo that you need to upload", event.threadID, event.messageID);
    }

    const attachment = event.messageReply.attachments[0];
    const attachmentUrl = attachment.url;
    const IMAGE_PATH = "image.jpeg";

    const { data: imageData } = await axios.get(attachmentUrl, {
      responseType: "arraybuffer",
    });

    await fs.promises.writeFile(IMAGE_PATH, imageData);

    const { md5Hash, content } = await getImageMd5Content(IMAGE_PATH);
    const client = axios.create({
      baseURL: BASE_URL,
      headers: { Authorization: `Bearer ${API_KEY}` },
      timeout: TIMEOUT,
    });

    console.log("Submitting image ...");
    const submitTaskResponse = await client.post("/tasks", {
      tools: [
        { type: "face_enhance", mode: "beautify" },
        { type: "background_enhance", mode: "base" },
      ],
      image_md5: md5Hash,
      image_content_type: CONTENT_TYPE,
      output_content_type: OUTPUT_CONTENT_TYPE,
    });

    const taskID = submitTaskResponse.data.task_id;
    const uploadURL = submitTaskResponse.data.upload_url;
    const uploadHeaders = submitTaskResponse.data.upload_headers;

    console.log("Uploading image to Google Cloud Storage ...");
    await axios.put(uploadURL, content, { headers: uploadHeaders });

    console.log(`Processing task: ${taskID} ...`);
    await client.post(`/tasks/${taskID}/process`);

    console.log(`Polling result for task: ${taskID} ...`);
    for (let i = 0; i < 50; i++) {
      const getTaskResponse = await client.get(`/tasks/${taskID}`);

      if (getTaskResponse.data.status === "completed") {
         console.log("Processing completed.")
         console.log("Output url: " + getTaskResponse.data.result.output_url);
         const enhancedImageUrl = getTaskResponse.data.result.output_url;
         await api.sendMessage({
            body: "✨ Enhanced Successfully",
            attachment: fs.createReadStream(IMAGE_PATH)
          }, event.threadID, () => fs.unlinkSync(IMAGE_PATH));

         await api.sendMessage({
            body: "✨ Enhanced Image URL: " + enhancedImageUrl
          }, event.threadID);

         return;
      } else {
        if (getTaskResponse.data.status !== "processing"){
          console.error("Found illegal status: "+getTaskResponse.data.status);
          return api.sendMessage(`🚫 Error processing image: ${getTaskResponse.data.status}`, event.threadID, event.messageID);
        }
        console.log("Processing, sleeping 2 seconds ...")
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }

    console.error("Timeout reached! :( ");
    api.sendMessage("🚫 Timeout reached while processing the image", event.threadID, event.messageID);
  } catch (error) {
    console.error("Error processing image:", error);
    api.sendMessage(`🚫 Error processing image: ${error.message}`, event.threadID, event.messageID);
  }
};

async function getImageMd5Content(filePath) {
  const content = await fs.promises.readFile(filePath);
  const md5Hash = crypto.createHash("md5").update(content).digest("base64");
  return { md5Hash, content };
}
