import { useEffect, useState } from 'react';
import {
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';

interface Drop {
  id: string;
  title: string;
  description: string;
  startAt: string;
  endAt: string;
  maxClaims: number;
  claimedCount: number;
  createdAt: string;
  updatedAt: string;
}

interface ClaimData {
  dropId: string;
  claimCode: string;
  claimedAt: string;
  dropTitle?: string;
}

interface DropsData {
  claimedDrops: Drop[];
  currentDrops: Drop[];
  upcomingDrops: Drop[];
}

const CLAIM_DATA_KEY = 'user_claim_data';

export default function Home() {
  const [drops, setDrops] = useState<DropsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [joinedDrops, setJoinedDrops] = useState<Set<string>>(new Set());
  const [loadingStates, setLoadingStates] = useState<{ [key: string]: boolean }>({});
  const [claimData, setClaimData] = useState<ClaimData[]>([]);

  useEffect(() => {
    fetchDrops();
    loadClaimDataFromStorage();
  }, []);

  const loadClaimDataFromStorage = () => {
    try {
      const stored = localStorage.getItem(CLAIM_DATA_KEY);
      if (stored) {
        const parsedData = JSON.parse(stored);
        setClaimData(parsedData);
      }
    } catch (error) {}
  };

  const saveClaimDataToStorage = (data: ClaimData[]) => {
    try {
      localStorage.setItem(CLAIM_DATA_KEY, JSON.stringify(data));
    } catch (error) {}
  };

  const fetchDrops = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/v1/drops', {
        credentials: 'include',
      });
      const data = await response.json();
      setDrops(data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (dropId: string, action: 'join' | 'leave' | 'claim') => {
    setLoadingStates((prev) => ({ ...prev, [dropId]: true }));
    try {
      const url = `http://localhost:5000/api/v1/drops/${dropId}/${action}`;
      const response = await fetch(url, { method: 'POST', credentials: 'include' });

      if (response.ok) {
        const responseData = await response.json();

        if (action === 'join') {
          setJoinedDrops((prev) => new Set([...prev, dropId]));
        } else if (action === 'leave') {
          setJoinedDrops((prev) => {
            const newSet = new Set(prev);
            newSet.delete(dropId);
            return newSet;
          });
        } else if (action === 'claim') {
          if (responseData.claimCode) {
            const currentDrop =
              drops?.currentDrops?.find((drop) => drop.id === dropId) ||
              drops?.claimedDrops?.find((drop) => drop.id === dropId);

            const newClaimData: ClaimData = {
              dropId: dropId,
              claimCode: responseData.claimCode,
              claimedAt: new Date().toISOString(),
              dropTitle: currentDrop?.title,
            };

            setClaimData((prev) => {
              const filtered = prev.filter((item) => item.dropId !== dropId);
              const newData = [...filtered, newClaimData];

              saveClaimDataToStorage(newData);

              return newData;
            });
          }

          await fetchDrops();
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingStates((prev) => ({ ...prev, [dropId]: false }));
    }
  };

  const getDropStatus = (drop: Drop) => {
    const now = new Date();
    const startAt = new Date(drop.startAt);
    const endAt = new Date(drop.endAt);
    const isStockFull = drop.claimedCount === drop.maxClaims;

    if (isStockFull) {
      return { status: 'sold-out', label: 'Sold Out' };
    }

    if (now < startAt) {
      return { status: 'upcoming', label: 'Starting Soon' };
    }

    if (now >= startAt && now <= endAt) {
      return { status: 'active', label: 'Active' };
    }

    return { status: 'expired', label: 'Ended' };
  };

  const DropCard = ({ drop }: { drop: Drop }) => {
    const status = getDropStatus(drop);
    const isJoined = joinedDrops.has(drop.id);
    const isLoading = loadingStates[drop.id];

    const dropClaimData = claimData.find((item) => item.dropId === drop.id);
    const isClaimed =
      !!dropClaimData || drops?.claimedDrops?.some((claimedDrop) => claimedDrop.id === drop.id);
    const claimCode = dropClaimData?.claimCode;

    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{drop.title}</h3>
            <p className="text-gray-600 text-sm mt-1">{drop.description}</p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${
              isClaimed
                ? 'bg-green-100 text-green-700'
                : status.status === 'active'
                ? 'bg-blue-100 text-[#155DFC]'
                : status.status === 'upcoming'
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {isClaimed ? 'Claimed' : status.label}
          </span>
        </div>

        <div className="space-y-2 text-sm text-gray-600 mb-4">
          <div className="flex justify-between">
            <span>Start:</span>
            <span className="text-gray-900 font-medium">
              {new Date(drop.startAt).toLocaleString('en-US')}
            </span>
          </div>
          <div className="flex justify-between">
            <span>End:</span>
            <span className="text-gray-900 font-medium">
              {new Date(drop.endAt).toLocaleString('en-US')}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Stock:</span>
            <span className="text-gray-900 font-medium">
              {drop.claimedCount} / {drop.maxClaims}
            </span>
          </div>

          {isClaimed && claimCode && (
            <div className="flex justify-between items-center pt-2 border-t border-gray-200">
              <span className="font-semibold text-green-600">Claim Code:</span>
              <div className="flex items-center gap-2">
                <code className="bg-green-50 text-green-700 px-2 py-1 rounded text-sm font-mono">
                  {claimCode}
                </code>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(claimCode);
                    alert('Claim code copied to clipboard!');
                  }}
                  className="text-green-600 hover:text-green-800"
                  title="Copy to clipboard"
                ></button>
              </div>
            </div>
          )}
        </div>

        {status.status === 'sold-out' ? (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded">
            <ExclamationCircleOutlined style={{ fontSize: '18px' }} />
            <span className="text-sm font-semibold">Stock completed</span>
          </div>
        ) : status.status === 'upcoming' ? (
          <button
            onClick={() => handleAction(drop.id, isJoined ? 'leave' : 'join')}
            disabled={isLoading}
            className={`w-full py-2 px-4 rounded font-semibold transition-colors ${
              isJoined
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-[#155DFC] hover:bg-blue-700 text-white'
            } disabled:opacity-50`}
          >
            {isLoading ? 'Loading...' : isJoined ? 'Leave Waitlist' : 'Join Waitlist'}
          </button>
        ) : status.status === 'active' ? (
          <button
            onClick={() => handleAction(drop.id, 'claim')}
            disabled={isLoading || isClaimed}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <CheckCircleOutlined style={{ fontSize: '18px' }} />
            {isLoading ? 'Processing...' : isClaimed ? 'Claimed ✓' : 'Claim'}
          </button>
        ) : (
          <div className="text-center text-gray-500 py-2">Campaign ended</div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin">
          <ClockCircleOutlined style={{ fontSize: '40px', color: '#155DFC' }} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {drops && drops.claimedDrops && drops.claimedDrops.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            <CheckCircleOutlined
              className="inline mr-2 text-green-600"
              style={{ fontSize: '28px' }}
            />
            My Claimed Drops
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {drops.claimedDrops.map((drop) => (
              <DropCard key={drop.id} drop={drop} />
            ))}
          </div>
        </section>
      )}

      {drops && drops.currentDrops && drops.currentDrops.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            <ClockCircleOutlined
              className="inline mr-2 text-[#155DFC]"
              style={{ fontSize: '28px' }}
            />
            Active Drops
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {drops.currentDrops.map((drop) => (
              <DropCard key={drop.id} drop={drop} />
            ))}
          </div>
        </section>
      )}

      {drops && drops.upcomingDrops && drops.upcomingDrops.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            <ClockCircleOutlined
              className="inline mr-2 text-yellow-600"
              style={{ fontSize: '28px' }}
            />
            Starting Soon
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {drops.upcomingDrops.map((drop) => (
              <DropCard key={drop.id} drop={drop} />
            ))}
          </div>
        </section>
      )}

      {!drops ||
      (drops.claimedDrops.length === 0 &&
        drops.currentDrops.length === 0 &&
        drops.upcomingDrops.length === 0) ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No Drops found</p>
        </div>
      ) : null}
    </div>
  );
}
