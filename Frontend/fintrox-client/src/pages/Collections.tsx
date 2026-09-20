import React, { useState, useEffect } from 'react';
import collectionApi, { type Collection, type CreateCollectionRequest } from '../api/collectionApi';
import loanApi, { type Loan } from '../api/loanApi';
import CollectionFilters from '../components/collections/CollectionFilters';
import CollectionList from '../components/collections/CollectionList';
import CollectionModal from '../components/collections/CollectionModal';
import CollectionReceiptDialog from '../components/collections/CollectionReceiptDialog';
import CollectionVerifyDialog from '../components/collections/CollectionVerifyDialog';


type CollectionStatsType = {
  todayCollection: number;
  totalCollections: number;
  averageCollection: number;
};

const Collections: React.FC = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<CollectionStatsType>({
    todayCollection: 0,
    totalCollections: 0,
    averageCollection: 0,
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filterMethod, setFilterMethod] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterLoan, setFilterLoan] = useState('');
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVerifyDialogOpen, setIsVerifyDialogOpen] = useState(false);
  const [isReceiptDialogOpen, setIsReceiptDialogOpen] = useState(false);
  const [verifyingCollection, setVerifyingCollection] = useState<Collection | null>(null);
  const [receiptCollection, setReceiptCollection] = useState<Collection | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    fetchCollections();
    fetchLoans();
  }, []);

  const calculateStats = (data: Collection[]): CollectionStatsType => {
    const today = new Date().toISOString().split('T')[0];
    const todayCollections = data.filter((c) => c.createdAt?.startsWith(today));
    const todayCollection = todayCollections.reduce((sum, c) => sum + (c.amount || 0), 0);
    const totalCollections = data.length;
    const totalAmount = data.reduce((sum, c) => sum + (c.amount || 0), 0);
    const averageCollection = totalCollections > 0 ? totalAmount / totalCollections : 0;
    return { todayCollection, totalCollections, averageCollection };
  };

  const fetchCollections = async () => {
    setLoading(true);
    try {
      const response = await collectionApi.getAll();
      const data = response.data.data;
      if (Array.isArray(data)) {
        setCollections(data);
        setTotalItems(data.length);
        setTotalPages(Math.ceil(data.length / 10) || 1);
        setStats(calculateStats(data));
      } else {
        setCollections([]);
      }
    } catch (error) {
      console.error('Error fetching collections:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLoans = async () => {
    try {
      const response = await loanApi.getAll();
      const data = response.data.data || [];
      setLoans(data.filter((l: Loan) => l.status === 'ACTIVE' || l.status === 'OVERDUE'));
    } catch (error) {
      console.error('Error fetching loans:', error);
    }
  };

  const handleCreate = async (data: CreateCollectionRequest) => {
    setModalLoading(true);
    try {
      const response = await collectionApi.create(data);
      const updated = [response.data.data, ...collections];
      setCollections(updated);
      setStats(calculateStats(updated));
      setIsModalOpen(false);
      fetchLoans();
    } catch (error) {
      console.error('Error recording collection:', error);
    } finally {
      setModalLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!verifyingCollection) return;
    setModalLoading(true);
    try {
      const response = await collectionApi.verify(verifyingCollection.id);
      const updated = collections.map((c) =>
        c.id === verifyingCollection.id ? response.data.data : c
      );
      setCollections(updated);
      setStats(calculateStats(updated));
      setIsVerifyDialogOpen(false);
      setVerifyingCollection(null);
    } catch (error) {
      console.error('Error verifying collection:', error);
    } finally {
      setModalLoading(false);
    }
  };

  const handleGenerateReceipt = async () => {
    if (!receiptCollection) return;
    setModalLoading(true);
    try {
      const response = await collectionApi.generateReceipt(receiptCollection.id);
      const updated = collections.map((c) =>
        c.id === receiptCollection.id ? response.data.data : c
      );
      setCollections(updated);
      setIsReceiptDialogOpen(false);
      setReceiptCollection(null);
      if (response.data.data.receiptUrl) {
        window.open(response.data.data.receiptUrl, '_blank');
      }
    } catch (error) {
      console.error('Error generating receipt:', error);
    } finally {
      setModalLoading(false);
    }
  };

  const filteredCollections = collections.filter((col) => {
    const matchesSearch =
      col.collectionNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      col.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      col.customerPhone?.includes(searchTerm) ||
      col.loanNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMethod = !filterMethod || col.paymentMethod === filterMethod;
    const matchesStatus =
      !filterStatus ||
      (filterStatus === 'verified' && col.isVerified) ||
      (filterStatus === 'pending' && !col.isVerified);
    const matchesLoan = !filterLoan || col.loanId === Number(filterLoan);
    const matchesDate = !filterDate || col.createdAt?.startsWith(filterDate);
    return matchesSearch && matchesMethod && matchesStatus && matchesLoan && matchesDate;
  });

  const formatCurrency = (val: number) => {
    return `₹${(val || 0).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Collections</h1>
          <p className="text-sm text-slate-500 mt-1">Track and verify all payment collections.</p>
        </div>
        <button
          className="bg-emerald-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-emerald-800 transition-colors shadow-sm text-sm font-semibold"
          onClick={() => setIsModalOpen(true)}
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          Record Collection
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Today's Collection</span>
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
              <span className="material-symbols-outlined">payments</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{formatCurrency(stats.todayCollection)}</div>
          <div className="mt-2 flex items-center gap-1 text-emerald-700 text-xs">
            <span className="material-symbols-outlined text-[16px]">trending_up</span>
            <span>Today's total</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Collections</span>
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-700">
              <span className="material-symbols-outlined">account_balance_wallet</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{stats.totalCollections}</div>
          <div className="mt-2 text-xs text-slate-500">All recorded payments</div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Average Collection</span>
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-700">
              <span className="material-symbols-outlined">analytics</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{formatCurrency(stats.averageCollection)}</div>
          <div className="mt-2 text-xs text-slate-500">Per collection</div>
        </div>
      </div>

      <CollectionFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterMethod={filterMethod}
        onMethodChange={setFilterMethod}
        filterStatus={filterStatus}
        onStatusChange={setFilterStatus}
        filterLoan={filterLoan}
        onLoanChange={setFilterLoan}
        filterDate={filterDate}
        onDateChange={setFilterDate}
        loans={loans}
      />

      <CollectionList
        collections={filteredCollections}
        loading={loading}
        onVerify={(col) => {
          setVerifyingCollection(col);
          setIsVerifyDialogOpen(true);
        }}
        onReceipt={(col) => {
          setReceiptCollection(col);
          setIsReceiptDialogOpen(true);
        }}
        onPageChange={setCurrentPage}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
      />

      <CollectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleCreate}
        loans={loans}
        loading={modalLoading}
      />

      <CollectionVerifyDialog
        isOpen={isVerifyDialogOpen}
        onClose={() => {
          setIsVerifyDialogOpen(false);
          setVerifyingCollection(null);
        }}
        onConfirm={handleVerify}
        collection={verifyingCollection}
        loading={modalLoading}
      />

      <CollectionReceiptDialog
        isOpen={isReceiptDialogOpen}
        onClose={() => {
          setIsReceiptDialogOpen(false);
          setReceiptCollection(null);
        }}
        onConfirm={handleGenerateReceipt}
        collection={receiptCollection}
        loading={modalLoading}
      />
    </div>
  );
};

export default Collections;