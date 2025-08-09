// 포트 상수 정의
export const PORTS = {
  // 백엔드 서버 포트
  BACKEND: process.env.REACT_APP_BACKEND_PORT || 4000,
  
  // BlazePose 서버 포트
  BLAZEPOSE: process.env.REACT_APP_BLAZEPOSE_PORT || 5001,
  
  // MongoDB 포트
  MONGODB: process.env.REACT_APP_MONGODB_PORT || 27017,
  
  // 프론트엔드 포트 (개발용)
  FRONTEND: process.env.REACT_APP_FRONTEND_PORT || 3000
} as const;

// URL 상수 정의
export const URLS = {
  // 백엔드 서버 URL
  BACKEND: process.env.REACT_APP_BACKEND_URL || `http://localhost:${PORTS.BACKEND}`,
  
  // BlazePose 서버 URL
  BLAZEPOSE: process.env.REACT_APP_BLAZEPOSE_SERVER_URL || `http://localhost:${PORTS.BLAZEPOSE}`,
  
  // MongoDB 연결 URL
  MONGODB: process.env.REACT_APP_MONGO_URI || `mongodb://localhost:${PORTS.MONGODB}`,
  
  // 프론트엔드 URL (개발용)
  FRONTEND: process.env.REACT_APP_FRONTEND_URL || `http://localhost:${PORTS.FRONTEND}`
} as const;
