export const metadata = {
  title: "세계 동화 교육 브리핑",
  description: "0-7세 유아교육자를 위한 세계 동화 교육 브리핑 서비스",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}
