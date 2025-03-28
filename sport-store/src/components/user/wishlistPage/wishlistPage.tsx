'use client';

export default function WishlistPage() {
  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-4">YÊU THÍCH</h2>
      <div className="border rounded">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-3 text-left text-gray-700 w-1/4">Sản Phẩm</th>
              <th className="p-3 text-left text-gray-700 w-1/6">Đánh Giá</th>
              <th className="p-3 text-left text-gray-700 w-1/6">Bình Luận</th>
              <th className="p-3 text-left text-gray-700 w-1/6">Trạng Thái</th>
              <th className="p-3 text-left text-gray-700 w-1/6">Thời Gian</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4].map((item, index) => (
              <tr key={index} className="border-t">
                <td className="p-3">
                  <a href="#" className="text-blue-500 hover:underline">
                    Nike Air Zoom Mercurial Superfly X Elite FG
                  </a>
                </td>
                <td className="p-3">
                  <div className="flex">
                    {[1, 2, 3, 4].map((star) => (
                      <span key={star} className="text-red-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                          />
                        </svg>
                      </span>
                    ))}
                  </div>
                </td>
                <td className="p-3">
                  <p>{'It\'s lovely, It\'s lovely'}</p>
                  <p>{'It\'s lovely'}</p>
                </td>
                <td className="p-3">
                  {index === 1 ? (
                    <span className="text-red-500 flex items-center gap-1">
                      Đã Hủy
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </span>
                  ) : index === 2 ? (
                    <span className="text-yellow-500">Chờ Duyệt!</span>
                  ) : (
                    <span className="text-green-500 flex items-center gap-1">
                      Đã Duyệt{' '}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </span>
                  )}
                </td>
                <td className="p-3">01/02/2025 11:00</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-between p-3 text-sm">
          <div>1 đến 10 trong tổng số 50 mục</div>
          <div>
            <button className="text-blue-500 hover:underline">
              Xem tất cả
            </button>
          </div>
        </div>
        <div className="flex justify-center p-3 gap-1">
          <button className="w-8 h-8 flex items-center justify-center border rounded">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button className="w-8 h-8 flex items-center justify-center border rounded bg-blue-500 text-white">
            1
          </button>
          <button className="w-8 h-8 flex items-center justify-center border rounded">
            2
          </button>
          <button className="w-8 h-8 flex items-center justify-center border rounded">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}