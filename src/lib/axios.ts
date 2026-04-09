import axios, { AxiosInstance } from "axios";

const LingvaT: AxiosInstance = axios.create({
  baseURL: process.env.LINGVA_URL || "http://lingvatranslate:3000/api/",
  headers: { "Content-Type": "application/json" },
});

const LibreT: AxiosInstance = axios.create({
  baseURL: process.env.LIBRE_URL || "http://libretranslate:5000",
  headers: { "Content-Type": "application/json" },
});
const KS_NET: AxiosInstance = axios.create({
  baseURL: "https://kingshot.net/api",
  headers: { "User-Agent": "DES-1405-DC-Bot/1.0" },
});
export { LingvaT, LibreT, KS_NET };
