import axios from "axios";
const LingvaT = axios.create({
  baseURL: process.env.LINGVA_URL || "http://localhost:8081/api/",
  headers: { "Content-Type": "application/json" },
});

const LibreT = axios.create({
  baseURL: process.env.LIBRE_URL || "http://localhost:8082",
  headers: { "Content-Type": "application/json" },
});
const KS_NET = axios.create({
  baseURL: "https://kingshot.net/api",
  headers: { "User-Agent": "DES-1405-DC-Bot/1.0" },
});
export { LingvaT, LibreT, KS_NET };
