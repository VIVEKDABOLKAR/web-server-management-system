import { useNavigate } from "react-router-dom";

const ServerCard = ({ server }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
      <h3 className="text-xl font-bold text-gray-800 mb-2">
        {server.serverName}
      </h3>
      <p className="font-mono text-sm text-gray-600 mb-4">{server.ipAddress}</p>

      <div className="space-y-2 mb-4">
        <p className="text-sm">
          <strong className="text-gray-600">OS:</strong> {server.osType}
        </p>
        <p className="text-sm">
          <strong className="text-gray-600">Web Server:</strong>{" "}
          {server.webServerType}
        </p>
      </div>

      <div className="mb-4">
        <span
          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
            server.status === "active"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {server.status}
        </span>
      </div>

      <button
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-medium transition"
        onClick={() => navigate(`/servers/${server._id}`)}
      >
        View Details
      </button>
    </div>
  );
};

export default ServerCard;
