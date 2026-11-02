import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  KanbanSquare, 
  Package, 
  BookOpen, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp,
  FileText,
  PenTool,
  Printer,
  Truck,
  Store,
  Users,
  Search,
  X,
  Image as ImageIcon,
  Upload,
  Receipt,
  Plus,
  DollarSign,
  Paperclip,
  Mail,
  Megaphone,
  Settings,
  RefreshCw,
  Share2,
  Download,
  Edit,
  Phone,
  Menu,
  Trash2,
  Settings2
} from 'lucide-react';

// --- Mock Data ---
// נתוני הדאשבורד הפכו למשתנה התחלתי שניתן לעריכה
const initialStatsData = {
  monthly: { inProduction: '12', completed: '145', sold: '3,240', revenue: '142,500', trend: '+18.5%', alerts: '3' },
  yearly: { inProduction: '12', completed: '34', sold: '38,500', revenue: '1,750,000', trend: '+42.3%', alerts: '3' }
};

const kanbanColumns = [
  { id: 'in_progress', title: 'ספרים בעבודה', icon: PenTool, color: 'border-blue-200 bg-blue-50' },
  { id: 'published', title: 'ספרים שיצאו', icon: BookOpen, color: 'border-emerald-200 bg-emerald-50' }
];

const initialKanbanTasks = {
  in_progress: [
    { id: 101, title: 'מסע אל הלא נודע', author: 'יעל כהן', date: '15/10/2026', coverFile: null, bookFile: 'טיוטה_ראשונית.docx', dedicationFile: null, invoices: [{ id: 1, desc: 'קריאת לקטורה', amount: 450, receiptFile: null }] },
    { id: 103, title: 'סודות המטבח האיטלקי', author: 'מיכל אהרוני', date: '01/11/2026', coverFile: null, bookFile: 'מטבח_איטלקי_עריכה.pdf', dedicationFile: null, invoices: [{ id: 2, desc: 'מקדמה לעורכת', amount: 1500, receiptFile: 'קבלה_עורכת.pdf' }] },
    { id: 104, title: 'כלכלת המחר', author: 'פרופ׳ יצחק לוי', date: '10/11/2026', coverFile: 'cover_draft_v2.jpg', bookFile: 'כלכלת_המחר_סופי.pdf', dedicationFile: null, invoices: [{ id: 3, desc: 'עריכה לשונית', amount: 2200, receiptFile: null }, { id: 4, desc: 'עיצוב כריכה', amount: 1800, receiptFile: null }] }
  ],
  published: [
    { id: 106, title: 'המדריך השלם לבינה מלאכותית', author: 'עמית שרון', date: '15/11/2026', coverFile: 'ai_cover_final.pdf', bookFile: 'ai_book_print.pdf', dedicationFile: 'ai_dedications.pdf', invoices: [{ id: 5, desc: 'עריכה ועימוד', amount: 5500, receiptFile: 'חשבונית_עימוד.pdf' }] }
  ]
};

const suppliers = [
  { id: 1, name: 'מחסן ראשי - פתח תקווה', type: 'מחסן לוגיסטי', contact: 'אבי כהן', phone: '050-1234567', email: 'avi@publisher-logistics.co.il', status: 'פעיל - יש הסכם' },
  { id: 2, name: 'צומת ספרים - מרלו"ג', type: 'רשת קמעונאית', contact: 'רונית לוי', phone: '052-7654321', email: 'ronit@zomet.co.il', status: 'פעיל - יש הסכם' },
  { id: 3, name: 'סטימצקי - הפצה', type: 'רשת קמעונאית', contact: 'דני אלמגור', phone: '054-9876543', email: 'dani@steimatzky.co.il', status: 'ממתין לספרים' },
  { id: 4, name: 'דפוס קורן בע"מ', type: 'בית דפוס', contact: 'שמואל קורן', phone: '02-6543210', email: 'office@koren-print.co.il', status: 'פעיל - יש הסכם' },
  { id: 5, name: 'חנויות עצמאיות (הפצה מרוכזת)', type: 'הפצה', contact: 'יעל מזרחי', phone: '050-9988776', email: 'indie-dist@publisher.co.il', status: 'אין שיתוף פעולה' }
];

const getStatusColor = (status) => {
  switch(status) {
    case 'פעיל - יש הסכם': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'ללא הסכם מכירה': return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'ממתין לספרים': return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'אין שיתוף פעולה': return 'bg-slate-100 text-slate-500 border-slate-200';
    default: return 'bg-slate-50 text-slate-700 border-slate-200';
  }
};

const marketingData = {
  campaigns: [
    { id: 1, name: 'קמפיין חגים - פייסבוק ואינסטגרם', book: 'סודות המטבח האיטלקי', budget: 4500, spent: 2100, roas: '2.4x' },
    { id: 2, name: 'קידום ממומן גוגל (Search)', book: 'המדריך השלם לבינה מלאכותית', budget: 2000, spent: 1850, roas: '3.1x' }
  ],
  prCopies: [
    { id: 1, recipient: 'עמית סגל (חדשות 12)', book: 'כלכלת המחר', date: '10/11/2026', status: 'נמסר ליעד' },
    { id: 2, recipient: 'book.tok.il@ (טיקטוק)', book: 'אגדות היער השחור', date: '12/11/2026', status: 'במשלוח' },
    { id: 3, recipient: 'מוסף ספרים - הארץ', book: 'מסע אל הלא נודע', date: '01/11/2026', status: 'פורסמה ביקורת' }
  ]
};

const initialIntegrations = [
  { id: 'morning', name: 'Morning (חשבונית ירוקה)', type: 'הנהלת חשבונות ומסמכים', connected: true, lastSync: 'לפני 15 דקות', logo: 'M' },
  { id: 'shopify', name: 'Shopify (אתר ההוצאה)', type: 'פלטפורמת מסחר / חנות אונליין', connected: true, lastSync: 'לפני שעתיים', logo: 'S' },
  { id: 'woocommerce', name: 'WooCommerce', type: 'פלטפורמת מסחר / חנות אונליין', connected: false, lastSync: 'לא סונכרן מעולם', logo: 'W' }
];

const initialInventory = [
  { 
    id: 1, title: 'המדריך השלם לבינה מלאכותית', author: 'עמית שרון', isbn: '978-965-123-456-7', threshold: 200, 
    editions: [{ name: 'מהדורה 1', printRun: 2000 }], publisherStock: 250,
    prices: { general: 110, supplier: 55, yeshiva: 70 },
    breakdown: [
      { supplier: 'מחסן ראשי - פתח תקווה', amount: 800 },
      { supplier: 'צומת ספרים - מרלו"ג', amount: 250 },
      { supplier: 'סטימצקי - הפצה', amount: 200 }
    ]
  },
  { 
    id: 2, title: 'שירת הים (מהדורה 1)', author: 'דוד אלמגור', isbn: '978-965-987-654-3', threshold: 100, 
    editions: [{ name: 'מהדורה 1', printRun: 500 }], publisherStock: 0,
    prices: { general: 88, supplier: 44, yeshiva: 60 },
    breakdown: [
      { supplier: 'מחסן ראשי - פתח תקווה', amount: 15 },
      { supplier: 'חנויות עצמאיות (הפצה מרוכזת)', amount: 30 }
    ]
  },
  { 
    id: 3, title: 'סודות המטבח האיטלקי', author: 'מיכל אהרוני', isbn: '978-965-456-789-0', threshold: 150, 
    editions: [{ name: 'מהדורה 1', printRun: 1500 }, { name: 'מהדורה 2', printRun: 1000 }], publisherStock: 100,
    prices: { general: 120, supplier: 60, yeshiva: 80 },
    breakdown: [
      { supplier: 'מחסן ראשי - פתח תקווה', amount: 400 },
      { supplier: 'צומת ספרים - מרלו"ג', amount: 300 },
      { supplier: 'סטימצקי - הפצה', amount: 150 }
    ]
  }
];

// --- רשימת משתמשים מורשית ---
const validUsers = [
  { username: 'admin', password: 'admin2026', role: 'admin', name: 'מנהל' },
  { username: 'view', password: 'view2026', role: 'viewer', name: 'צופה' }
];

export default function PublisherApp() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userRole, setUserRole] = useState(null); 
  const [currentUserName, setCurrentUserName] = useState(''); 
  const [dashboardPeriod, setDashboardPeriod] = useState('monthly'); 
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // --- Auth States ---
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // --- Dashboard Editing States ---
  const [statsData, setStatsData] = useState(initialStatsData);
  const [isEditStatsModalOpen, setIsEditStatsModalOpen] = useState(false);
  const [editingStats, setEditingStats] = useState(null);

  // --- Suppliers States ---
  const [suppliersList, setSuppliersList] = useState(suppliers);
  const [isAddSupplierModalOpen, setIsAddSupplierModalOpen] = useState(false);
  const [newSupplier, setNewSupplier] = useState({ name: '', type: 'רשת קמעונאית', contact: '', phone: '', email: '', status: 'פעיל - יש הסכם' });
  const [isEditSupplierModalOpen, setIsEditSupplierModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [selectedSupplierForStock, setSelectedSupplierForStock] = useState(null);

  // --- Marketing & PR States ---
  const [prCopies, setPrCopies] = useState(marketingData.prCopies);
  const [isEditPrModalOpen, setIsEditPrModalOpen] = useState(false);
  const [editingPr, setEditingPr] = useState(null);

  // --- Inventory States ---
  const [searchQuery, setSearchQuery] = useState('');
  const [inventoryList, setInventoryList] = useState(initialInventory);
  
  const initialBookFormState = {
    title: '', author: '', isbn: '', threshold: 50,
    editions: [{ name: 'מהדורה 1', printRun: 1000 }],
    publisherStock: 0,
    prices: { general: 0, supplier: 0, yeshiva: 0 },
    breakdown: []
  };

  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);
  const [newBookForm, setNewBookForm] = useState(initialBookFormState);

  const [isEditBookModalOpen, setIsEditBookModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);

  // --- Kanban State ---
  const [tasks, setTasks] = useState(initialKanbanTasks);
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskColumn, setTaskColumn] = useState(null);
  const [newInvoice, setNewInvoice] = useState({ desc: '', amount: '' });

  // --- Integrations State ---
  const [integrations, setIntegrations] = useState(initialIntegrations);
  const [isSyncing, setIsSyncing] = useState(null);

  // --- Handlers ---
  const handleLogin = (e) => {
    e.preventDefault();
    const user = validUsers.find(u => u.username === username && u.password === password);
    if (user) {
      setUserRole(user.role);
      setCurrentUserName(user.name);
      setLoginError('');
    } else {
      setLoginError('שם משתמש או סיסמה שגויים. נסה שוב.');
    }
  };

  // Helper to calculate total stock
  const calculateTotalStock = (book) => {
    const suppliersTotal = book.breakdown.reduce((sum, item) => sum + Number(item.amount), 0);
    return Number(book.publisherStock) + suppliersTotal;
  };

  const handleExportCSV = () => {
    const headers = ['שם הספר', 'מחבר', 'דאנאק', 'מלאי בהוצאה', 'סה"כ במלאי כללי'];
    const rows = inventoryList.map(b => [b.title, b.author, b.isbn, b.publisherStock, calculateTotalStock(b)]);
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(','), ...rows.map(e => e.join(','))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "inventory_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Dashboard Stats Handlers
  const openEditStats = () => {
    setEditingStats({ ...statsData[dashboardPeriod] });
    setIsEditStatsModalOpen(true);
  };

  const handleEditStatsSubmit = (e) => {
    e.preventDefault();
    setStatsData({
      ...statsData,
      [dashboardPeriod]: editingStats
    });
    setIsEditStatsModalOpen(false);
  };

  // Supplier Handlers
  const handleAddSupplier = (e) => {
    e.preventDefault();
    setSuppliersList([...suppliersList, { ...newSupplier, id: Date.now() }]);
    setIsAddSupplierModalOpen(false);
    setNewSupplier({ name: '', type: 'רשת קמעונאית', contact: '', phone: '', email: '', status: 'פעיל - יש הסכם' });
  };

  const handleEditSupplierSubmit = (e) => {
    e.preventDefault();
    setSuppliersList(suppliersList.map(s => s.id === editingSupplier.id ? editingSupplier : s));
    setIsEditSupplierModalOpen(false);
  };

  // PR Handlers
  const handleEditPrSubmit = (e) => {
    e.preventDefault();
    setPrCopies(prCopies.map(pr => pr.id === editingPr.id ? editingPr : pr));
    setIsEditPrModalOpen(false);
  };

  // Book Editions Handlers
  const handleAddEdition = (formSetter, formState) => {
    formSetter({
      ...formState,
      editions: [...formState.editions, { name: `מהדורה ${formState.editions.length + 1}`, printRun: 0 }]
    });
  };

  const handleUpdateEdition = (formSetter, formState, index, field, value) => {
    const updatedEditions = [...formState.editions];
    updatedEditions[index][field] = field === 'printRun' ? Number(value) : value;
    formSetter({ ...formState, editions: updatedEditions });
  };

  const handleRemoveEdition = (formSetter, formState, index) => {
    const updatedEditions = formState.editions.filter((_, i) => i !== index);
    formSetter({ ...formState, editions: updatedEditions });
  };

  // Add Book Handlers
  const handleAddBook = (e) => {
    e.preventDefault();
    const newBook = { ...newBookForm, id: Date.now() };
    setInventoryList([...inventoryList, newBook]);
    setIsAddBookModalOpen(false);
    setNewBookForm(initialBookFormState);
  };

  const handleAddBookBreakdownRow = () => {
    setNewBookForm({ ...newBookForm, breakdown: [...newBookForm.breakdown, { supplier: '', amount: 0 }] });
  };

  const handleUpdateBookBreakdownRow = (index, field, value) => {
    const updatedBreakdown = [...newBookForm.breakdown];
    updatedBreakdown[index][field] = field === 'amount' ? Number(value) : value;
    setNewBookForm({ ...newBookForm, breakdown: updatedBreakdown });
  };

  const handleRemoveBookBreakdownRow = (index) => {
    const updatedBreakdown = newBookForm.breakdown.filter((_, i) => i !== index);
    setNewBookForm({ ...newBookForm, breakdown: updatedBreakdown });
  };

  // Edit Book Handlers
  const openEditBook = (book) => {
    setEditingBook(JSON.parse(JSON.stringify(book))); 
    setIsEditBookModalOpen(true);
  };

  const handleEditBookSubmit = (e) => {
    e.preventDefault();
    setInventoryList(inventoryList.map(b => b.id === editingBook.id ? editingBook : b));
    setIsEditBookModalOpen(false);
    setEditingBook(null);
  };

  const handleEditBookBreakdownRow = () => {
    setEditingBook({ ...editingBook, breakdown: [...editingBook.breakdown, { supplier: '', amount: 0 }] });
  };

  const handleUpdateEditBookBreakdownRow = (index, field, value) => {
    const updatedBreakdown = [...editingBook.breakdown];
    updatedBreakdown[index][field] = field === 'amount' ? Number(value) : value;
    setEditingBook({ ...editingBook, breakdown: updatedBreakdown });
  };

  const handleRemoveEditBookBreakdownRow = (index) => {
    const updatedBreakdown = editingBook.breakdown.filter((_, i) => i !== index);
    setEditingBook({ ...editingBook, breakdown: updatedBreakdown });
  };

  const handleDeleteBook = (id) => {
    if (window.confirm("האם אתה בטוח שברצונך למחוק ספר זה מהמלאי לצמיתות?")) {
      setInventoryList(inventoryList.filter(book => book.id !== id));
    }
  };

  const handleToggleIntegration = (id) => {
    if (userRole !== 'admin') return;
    setIntegrations(integrations.map(int => 
      int.id === id ? { ...int, connected: !int.connected, lastSync: !int.connected ? 'כרגע' : int.lastSync } : int
    ));
  };

  const handleSync = (id) => {
    if (userRole !== 'admin') return;
    setIsSyncing(id);
    setTimeout(() => {
      setIntegrations(integrations.map(int => 
        int.id === id ? { ...int, lastSync: 'לפני מספר שניות' } : int
      ));
      setIsSyncing(null);
    }, 1500);
  };

  const getSupplierStock = (supplierName) => {
    return inventoryList.reduce((acc, book) => {
      const found = book.breakdown.find(b => b.supplier === supplierName);
      if (found && found.amount > 0) {
        acc.push({ title: book.title, author: book.author, amount: found.amount, isbn: book.isbn });
      }
      return acc;
    }, []);
  };

  const filteredInventory = inventoryList.filter(book =>
    book.title.includes(searchQuery) ||
    book.author.includes(searchQuery) ||
    book.isbn.includes(searchQuery)
  );

  const handleAddInvoice = (e) => {
    e.preventDefault();
    if (!newInvoice.desc || !newInvoice.amount) return;
    const updatedTask = { ...selectedTask, invoices: [...selectedTask.invoices, { id: Date.now(), desc: newInvoice.desc, amount: Number(newInvoice.amount), receiptFile: null }] };
    setTasks({ ...tasks, [taskColumn]: tasks[taskColumn].map(t => t.id === selectedTask.id ? updatedTask : t) });
    setSelectedTask(updatedTask);
    setNewInvoice({ desc: '', amount: '' });
  };

  const handleInvoiceReceiptUpload = (invoiceId) => {
    const updatedTask = { ...selectedTask, invoices: selectedTask.invoices.map(inv => inv.id === invoiceId ? { ...inv, receiptFile: 'אסמכתא_הועלתה.pdf' } : inv) };
    setTasks({ ...tasks, [taskColumn]: tasks[taskColumn].map(t => t.id === selectedTask.id ? updatedTask : t) });
    setSelectedTask(updatedTask);
  };

  const handleFileUpload = (type) => {
    let fileName = type === 'coverFile' ? 'new_cover_uploaded.jpg' : type === 'bookFile' ? 'book_manuscript_v2.pdf' : 'dedications_list.docx';
    const updatedTask = { ...selectedTask, [type]: fileName };
    setTasks({ ...tasks, [taskColumn]: tasks[taskColumn].map(t => t.id === selectedTask.id ? updatedTask : t) });
    setSelectedTask(updatedTask);
  };

  const navItems = [
    { id: 'dashboard', label: 'דאשבורד', icon: LayoutDashboard },
    { id: 'inventory', label: 'ניהול מלאי', icon: Package },
    { id: 'suppliers', label: 'ספקים והפצה', icon: Truck },
    { id: 'production', label: 'הפקת ספרים', icon: KanbanSquare },
    { id: 'marketing', label: 'שיווק ויח״צ', icon: Megaphone },
    { id: 'integrations', label: 'אוטומציה וחיבורים', icon: Settings },
  ];

  if (!userRole) {
    return (
      <div dir="rtl" className="flex h-screen w-full items-center justify-center bg-slate-50 font-sans p-4">
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg max-w-md w-full text-center border border-slate-100 animate-in fade-in zoom-in duration-300">
          <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="text-indigo-600 w-8 h-8" />
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-800 mb-2">מערכת ניהול הוצאה לאור</h1>
          <p className="text-slate-500 mb-6 text-sm md:text-base">הזן פרטי התחברות כדי לגשת למערכת</p>
          
          <form onSubmit={handleLogin} className="space-y-4 text-right">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">שם משתמש</label>
              <input type="text" required value={username} onChange={(e) => setUsername(e.target.value)} className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50 focus:bg-white text-sm" dir="ltr" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">סיסמה</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50 focus:bg-white text-sm" dir="ltr" />
            </div>
            {loginError && <div className="text-red-500 text-sm bg-red-50 p-2 rounded-lg text-center font-medium">{loginError}</div>}
            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-xl font-medium transition-colors shadow-sm mt-2">התחבר למערכת</button>
          </form>
        </div>
      </div>
    );
  }

  // --- Dynamic Dashboard Stats Array ---
  const currentStats = statsData[dashboardPeriod];
  const dashboardStatsArray = [
    { id: 1, title: 'ספרים בהפקה', value: currentStats.inProduction, icon: PenTool, color: 'text-blue-600', bgColor: 'bg-blue-100' },
    { id: 2, title: dashboardPeriod === 'monthly' ? 'ספרים שהושלמו' : 'ספרים שהושלמו (השנה)', value: currentStats.completed, icon: BookOpen, color: 'text-indigo-600', bgColor: 'bg-indigo-100' },
    { id: 3, title: dashboardPeriod === 'monthly' ? 'נמכרו החודש (עותקים)' : 'נמכרו השנה (עותקים)', value: currentStats.sold, icon: Package, color: 'text-emerald-600', bgColor: 'bg-emerald-100' },
    { id: 4, title: dashboardPeriod === 'monthly' ? 'רווח מכירות חודשי (₪)' : 'רווח מכירות שנתי (₪)', value: `₪${currentStats.revenue}`, icon: DollarSign, color: 'text-green-600', bgColor: 'bg-green-100' },
    { id: 5, title: dashboardPeriod === 'monthly' ? 'מגמת מכירות (חודשי)' : 'גידול שנתי במכירות', value: currentStats.trend, icon: TrendingUp, color: 'text-purple-600', bgColor: 'bg-purple-100' },
    { id: 6, title: 'התראות מלאי נמוך', value: currentStats.alerts, icon: AlertTriangle, color: 'text-amber-600', bgColor: 'bg-amber-100' }
  ];

  return (
    <div dir="rtl" className="flex h-screen w-full bg-slate-50 text-slate-800 font-sans overflow-hidden">
      
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-slate-900/60 z-40 md:hidden backdrop-blur-sm transition-opacity" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 right-0 z-50 w-64 bg-white border-l border-slate-200 flex flex-col shadow-2xl transform transition-transform duration-300 md:relative md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'} print:hidden`}>
        <div className="p-4 md:p-6 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg"><BookOpen className="text-white w-5 h-5 md:w-6 md:h-6" /></div>
            <h1 className="text-lg md:text-xl font-bold text-slate-800 tracking-tight">הוצאה לאור</h1>
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-slate-400 hover:text-slate-600 bg-slate-50 p-1.5 rounded-md"><X className="w-5 h-5" /></button>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button key={item.id} onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-sm' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
                <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />{item.label}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="bg-white p-3 md:p-6 shadow-sm border-b border-slate-200 flex justify-between items-center z-10 print:hidden">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden text-slate-500 hover:text-indigo-600 p-2 rounded-lg hover:bg-indigo-50 transition-colors"><Menu className="w-6 h-6" /></button>
            <h2 className="text-lg md:text-2xl font-bold text-slate-800 truncate">{navItems.find(item => item.id === activeTab)?.label}</h2>
          </div>
          <div className="flex items-center gap-3 md:gap-4">
            <div className="hidden md:block text-sm text-slate-500">שלום, <span className="font-semibold text-slate-700">{currentUserName}</span></div>
            <button onClick={() => { setUserRole(null); setCurrentUserName(''); setUsername(''); setPassword(''); setLoginError(''); }} className="text-xs md:text-sm font-medium text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1.5 md:px-3 md:py-1.5 rounded-lg transition-colors border border-transparent">התנתק</button>
            <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-sm md:text-base ${userRole === 'admin' ? 'bg-indigo-100 border-2 border-indigo-200 text-indigo-700' : 'bg-slate-100 border-2 border-slate-200 text-slate-600'}`}>{userRole === 'admin' ? 'מ' : 'צ'}</div>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="flex-1 p-3 md:p-8 overflow-y-auto w-full max-w-full">
          
          {/* DASHBOARD VIEW */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 md:space-y-8 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
                  <h3 className="text-lg md:text-xl font-bold text-slate-800">סיכום נתונים</h3>
                  {userRole === 'admin' && (
                    <button onClick={openEditStats} className="text-slate-400 hover:text-indigo-600 p-1.5 rounded-lg hover:bg-indigo-50 transition-colors" title="ערוך נתוני דאשבורד">
                      <Settings2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
                <div className="bg-slate-200/60 p-1 rounded-xl flex items-center border border-slate-200 w-full sm:w-auto">
                  <button onClick={() => setDashboardPeriod('monthly')} className={`flex-1 sm:flex-none px-3 md:px-5 py-2 rounded-lg text-xs md:text-sm font-medium transition-all duration-200 text-center ${dashboardPeriod === 'monthly' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-800'}`}>סיכום חודשי</button>
                  <button onClick={() => setDashboardPeriod('yearly')} className={`flex-1 sm:flex-none px-3 md:px-5 py-2 rounded-lg text-xs md:text-sm font-medium transition-all duration-200 text-center ${dashboardPeriod === 'yearly' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-800'}`}>סיכום שנתי</button>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                {dashboardStatsArray.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.id} className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-4 transition-transform hover:-translate-y-1">
                      <div className={`p-2.5 md:p-4 rounded-xl ${stat.bgColor} ${stat.color} self-start md:self-auto`}><Icon className="w-5 h-5 md:w-6 md:h-6" /></div>
                      <div>
                        <p className="text-[10px] md:text-sm font-medium text-slate-500 mb-0.5 md:mb-1">{stat.title}</p>
                        <h3 className="text-base md:text-2xl font-bold text-slate-800">{stat.value}</h3>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* INVENTORY VIEW */}
          {activeTab === 'inventory' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-in fade-in duration-300 flex flex-col h-full md:h-auto">
              <div className="p-4 md:p-6 border-b border-slate-100 flex flex-col gap-4 shrink-0">
                <h3 className="text-lg font-bold text-slate-800">מצב מלאי מחסנים ורשתות</h3>
                <div className="flex flex-col lg:flex-row gap-3 lg:items-center justify-between">
                  <div className="relative w-full lg:w-96 print:hidden">
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"><Search className="h-5 w-5 text-slate-400" /></div>
                    <input type="text" placeholder="חיפוש..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="block w-full pr-10 pl-3 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 text-sm" />
                  </div>
                  <div className="grid grid-cols-2 sm:flex sm:flex-row gap-2 w-full lg:w-auto print:hidden">
                    <button onClick={() => window.print()} className="bg-white border border-slate-200 hover:bg-slate-50 px-3 py-2 md:py-2.5 rounded-lg text-xs md:text-sm flex items-center justify-center gap-1.5 md:gap-2 whitespace-nowrap"><Printer className="w-3.5 h-3.5 md:w-4 md:h-4" /> הדפס</button>
                    <button onClick={handleExportCSV} className="bg-slate-100 hover:bg-slate-200 px-3 py-2 md:py-2.5 rounded-lg text-xs md:text-sm flex items-center justify-center gap-1.5 md:gap-2 whitespace-nowrap"><Download className="w-3.5 h-3.5 md:w-4 md:h-4" /> ייצוא</button>
                    {userRole === 'admin' && (
                      <button onClick={() => setIsAddBookModalOpen(true)} className="col-span-2 sm:col-span-1 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 md:py-2.5 rounded-lg text-xs md:text-sm flex items-center justify-center gap-1.5 md:gap-2 shadow-sm whitespace-nowrap"><Plus className="w-3.5 h-3.5 md:w-4 md:h-4" /> הוסף ספר</button>
                    )}
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-right min-w-[900px]">
                  <thead className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
                    <tr>
                      <th className="py-4 px-4 font-medium">שם הספר / דאנאק</th>
                      <th className="py-4 px-4 font-medium">מהדורות שהודפסו</th>
                      <th className="py-4 px-4 font-medium text-center bg-indigo-50/50">מחסן ההוצאה</th>
                      <th className="py-4 px-4 font-medium">פירוט אצל ספקים/חנויות</th>
                      <th className="py-4 px-4 font-medium text-center bg-emerald-50/50">סה"כ מלאי זמין</th>
                      <th className="py-4 px-4 font-medium text-center">סטטוס</th>
                      {userRole === 'admin' && <th className="py-4 px-4 font-medium text-center print:hidden">פעולות</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredInventory.map((book) => {
                      const totalAvailableStock = calculateTotalStock(book);
                      const isLowStock = totalAvailableStock <= book.threshold;
                      return (
                        <tr key={book.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-4 px-4 text-slate-600">
                            <div className="font-bold text-slate-800">{book.title}</div>
                            <div className="text-sm">{book.author}</div>
                            <div className="text-slate-400 font-mono text-xs mt-1">{book.isbn}</div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex flex-col gap-1">
                              {book.editions?.map((ed, i) => (
                                <div key={i} className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-600 flex justify-between gap-2">
                                  <span>{ed.name}</span><span className="font-bold">{ed.printRun.toLocaleString()} עותקים</span>
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className="py-4 px-4 text-center bg-indigo-50/30">
                            <div className="font-bold text-indigo-700 text-xl">{Number(book.publisherStock).toLocaleString()}</div>
                            <div className="text-[10px] text-indigo-400">במחסן הראשי</div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex flex-col gap-1.5 min-w-[180px]">
                              {book.breakdown.length > 0 ? book.breakdown.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center text-xs md:text-sm border-b border-slate-100/50 pb-1 last:border-0 last:pb-0 gap-2">
                                  <span className="text-slate-500 truncate">{item.supplier}</span>
                                  <span className="font-semibold text-slate-700 bg-white border border-slate-200 px-2 py-0.5 rounded text-xs">{item.amount.toLocaleString()}</span>
                                </div>
                              )) : <span className="text-xs text-slate-400">לא משויך לספקים</span>}
                            </div>
                          </td>
                          <td className="py-4 px-4 text-center bg-emerald-50/30">
                            <div className="font-bold text-emerald-700 text-xl md:text-2xl">{totalAvailableStock.toLocaleString()}</div>
                          </td>
                          <td className="py-4 px-4 text-center">
                            {isLowStock ? (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] md:text-xs font-medium bg-red-100 text-red-700 whitespace-nowrap"><AlertTriangle className="w-3 h-3" /> להדפיס</span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] md:text-xs font-medium bg-emerald-100 text-emerald-700 whitespace-nowrap"><CheckCircle className="w-3 h-3" /> תקין</span>
                            )}
                          </td>
                          {userRole === 'admin' && (
                            <td className="py-4 px-2 md:px-4 text-center print:hidden whitespace-nowrap">
                              <button onClick={() => openEditBook(book)} className="text-slate-400 hover:text-indigo-600 p-1.5 md:p-2 md:mx-1 rounded-lg hover:bg-indigo-50"><Edit className="w-4 h-4 md:w-5 md:h-5" /></button>
                              <button onClick={() => handleDeleteBook(book.id)} className="text-slate-400 hover:text-red-500 p-1.5 md:p-2 md:mx-1 rounded-lg hover:bg-red-50"><Trash2 className="w-4 h-4 md:w-5 md:h-5" /></button>
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SUPPLIERS VIEW */}
          {activeTab === 'suppliers' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h3 className="text-lg md:text-xl font-bold text-slate-800">ניהול ספקים, מחסנים ורשתות הפצה</h3>
                {userRole === 'admin' && (
                  <button onClick={() => setIsAddSupplierModalOpen(true)} className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg font-medium flex justify-center items-center gap-2"><Plus className="w-4 h-4" /> הוסף ספק חדש</button>
                )}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                {suppliersList.map((supplier) => (
                  <div key={supplier.id} className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow flex flex-col relative group">
                    {userRole === 'admin' && (
                      <button onClick={() => { setEditingSupplier(supplier); setIsEditSupplierModalOpen(true); }} className="absolute top-4 left-4 p-2 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                        <Edit className="w-4 h-4" />
                      </button>
                    )}
                    <div className="flex justify-between items-start mb-4 pr-2">
                      <div>
                        <h4 className="font-bold text-base md:text-lg text-slate-800">{supplier.name}</h4>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="inline-block px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-md">{supplier.type}</span>
                          <span className={`inline-block px-2.5 py-1 text-xs font-medium rounded-md border ${getStatusColor(supplier.status)}`}>{supplier.status}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3 pt-4 border-t border-slate-100 flex-1">
                      <div className="flex items-center gap-3 text-sm text-slate-600"><Users className="w-4 h-4 text-slate-400" /> {supplier.contact}</div>
                      <div className="flex items-center gap-3 text-sm text-slate-600" dir="ltr"><Phone className="w-4 h-4 text-slate-400" /> {supplier.phone}</div>
                      <div className="flex items-center gap-3 text-sm text-slate-600"><FileText className="w-4 h-4 text-slate-400" /> {supplier.email}</div>
                    </div>
                    <div className="pt-5 mt-4 border-t border-slate-50">
                      <button onClick={() => setSelectedSupplierForStock(supplier)} className="w-full flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-700 py-2.5 rounded-lg text-sm font-medium transition-colors"><Package className="w-4 h-4" /> צפה במלאי</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MARKETING AND PR VIEW */}
          {activeTab === 'marketing' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 animate-in fade-in duration-300 w-full">
              {/* Marketing Campaigns */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col w-full overflow-hidden">
                <div className="p-4 md:p-6 border-b border-slate-100"><h3 className="text-base md:text-lg font-bold flex items-center gap-2"><Megaphone className="w-5 h-5 text-indigo-600" /> קמפיינים</h3></div>
                <div className="p-4 md:p-6 space-y-5 md:space-y-6">
                  {marketingData.campaigns.map(camp => (
                    <div key={camp.id} className="space-y-2">
                       <div className="flex justify-between items-center gap-2">
                           <div className="font-bold text-xs md:text-sm text-slate-700 truncate">{camp.name}</div>
                           <div className="text-[10px] md:text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 md:py-1 rounded shrink-0">החזר: {camp.roas}</div>
                       </div>
                       <div className="flex justify-between text-[10px] md:text-xs text-slate-500">
                           <span>נוצל: ₪{camp.spent.toLocaleString()}</span>
                           <span>מתוך ₪{camp.budget.toLocaleString()}</span>
                       </div>
                       <div className="w-full bg-slate-100 rounded-full h-1.5 md:h-2"><div className="bg-indigo-500 h-1.5 md:h-2 rounded-full" style={{ width: `${(camp.spent/camp.budget)*100}%`}}></div></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* PR & Review Copies */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col w-full overflow-hidden">
                <div className="p-4 md:p-6 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="text-base md:text-lg font-bold text-slate-800 flex items-center gap-2"><Share2 className="w-5 h-5 text-pink-500" /> עותקי סיקור ויח"צ</h3>
                </div>
                <div className="p-0 flex-1 overflow-x-auto w-full">
                  <table className="w-full text-right text-sm min-w-[350px]">
                    <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 md:py-3 px-3 md:px-4 font-medium text-xs md:text-sm">נמען</th>
                        <th className="py-2.5 md:py-3 px-3 md:px-4 font-medium text-xs md:text-sm">ספר נשלח</th>
                        <th className="py-2.5 md:py-3 px-3 md:px-4 font-medium text-center text-xs md:text-sm">סטטוס</th>
                        {userRole === 'admin' && <th className="py-2.5 md:py-3 px-2 md:px-4 font-medium text-center text-xs md:text-sm">ערוך</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {prCopies.map(pr => (
                        <tr key={pr.id} className="hover:bg-slate-50">
                          <td className="py-2.5 md:py-3 px-3 md:px-4 font-medium text-slate-700 text-xs md:text-sm truncate max-w-[100px] md:max-w-none">{pr.recipient}</td>
                          <td className="py-2.5 md:py-3 px-3 md:px-4 text-slate-500 text-xs md:text-sm truncate max-w-[100px] md:max-w-none">{pr.book}</td>
                          <td className="py-2.5 md:py-3 px-3 md:px-4 text-center">
                            <span className={`inline-flex px-1.5 md:px-2 py-0.5 md:py-1 rounded-md text-[9px] md:text-[10px] lg:text-xs font-medium whitespace-nowrap ${pr.status === 'פורסמה ביקורת' ? 'bg-emerald-100 text-emerald-700' : pr.status === 'נמסר ליעד' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>{pr.status}</span>
                          </td>
                          {userRole === 'admin' && (
                            <td className="py-2.5 md:py-3 px-2 md:px-4 text-center">
                              <button onClick={() => { setEditingPr(pr); setIsEditPrModalOpen(true); }} className="text-slate-400 hover:text-indigo-600 p-1 md:p-1.5"><Edit className="w-3.5 h-3.5 md:w-4 md:h-4" /></button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* --- MODALS --- */}
      
      {/* Edit Dashboard Stats Modal */}
      {isEditStatsModalOpen && editingStats && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col" dir="rtl">
            <div className="p-4 md:p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
              <h3 className="font-bold text-base md:text-lg text-slate-800">עריכת נתוני דאשבורד ({dashboardPeriod === 'monthly' ? 'חודשי' : 'שנתי'})</h3>
              <button onClick={() => setIsEditStatsModalOpen(false)} className="text-slate-400 hover:text-slate-600 bg-white p-1.5 rounded-md shadow-sm border border-slate-200"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-4 md:p-6 overflow-y-auto">
              <form onSubmit={handleEditStatsSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className="block text-sm mb-1 text-slate-700">ספרים בהפקה</label><input type="text" value={editingStats.inProduction} onChange={e => setEditingStats({...editingStats, inProduction: e.target.value})} className="w-full p-2.5 md:p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 bg-slate-50" /></div>
                  <div><label className="block text-sm mb-1 text-slate-700">ספרים שהושלמו</label><input type="text" value={editingStats.completed} onChange={e => setEditingStats({...editingStats, completed: e.target.value})} className="w-full p-2.5 md:p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 bg-slate-50" /></div>
                  <div><label className="block text-sm mb-1 text-slate-700">עותקים שנמכרו</label><input type="text" value={editingStats.sold} onChange={e => setEditingStats({...editingStats, sold: e.target.value})} className="w-full p-2.5 md:p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 bg-slate-50" /></div>
                  <div><label className="block text-sm mb-1 text-slate-700">רווח (₪)</label><input type="text" value={editingStats.revenue} onChange={e => setEditingStats({...editingStats, revenue: e.target.value})} className="w-full p-2.5 md:p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 bg-slate-50" /></div>
                  <div><label className="block text-sm mb-1 text-slate-700">מגמת צמיחה</label><input type="text" value={editingStats.trend} onChange={e => setEditingStats({...editingStats, trend: e.target.value})} className="w-full p-2.5 md:p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 bg-slate-50" dir="ltr" /></div>
                  <div><label className="block text-sm mb-1 text-slate-700">התראות מלאי</label><input type="text" value={editingStats.alerts} onChange={e => setEditingStats({...editingStats, alerts: e.target.value})} className="w-full p-2.5 md:p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 bg-slate-50" /></div>
                </div>
                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-medium mt-4">שמור שינויים</button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Supplier Modal */}
      {isEditSupplierModalOpen && editingSupplier && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col" dir="rtl">
            <div className="p-4 md:p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
              <h3 className="font-bold text-base md:text-lg text-slate-800">עריכת ספק: {editingSupplier.name}</h3>
              <button onClick={() => setIsEditSupplierModalOpen(false)} className="text-slate-400 hover:text-slate-600 bg-white p-1.5 rounded-md shadow-sm border border-slate-200"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-4 md:p-6 overflow-y-auto">
              <form onSubmit={handleEditSupplierSubmit} className="space-y-4">
                <div><label className="block text-sm font-medium mb-1">שם</label><input required type="text" value={editingSupplier.name} onChange={e => setEditingSupplier({...editingSupplier, name: e.target.value})} className="w-full p-2.5 md:p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 bg-slate-50" /></div>
                <div><label className="block text-sm font-medium mb-1">סוג</label><select value={editingSupplier.type} onChange={e => setEditingSupplier({...editingSupplier, type: e.target.value})} className="w-full p-2.5 md:p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 bg-slate-50"><option>רשת קמעונאית</option><option>הפצה</option><option>מחסן לוגיסטי</option><option>בית דפוס</option></select></div>
                <div><label className="block text-sm font-medium mb-1">סטטוס</label><select value={editingSupplier.status} onChange={e => setEditingSupplier({...editingSupplier, status: e.target.value})} className="w-full p-2.5 md:p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 bg-slate-50"><option>פעיל - יש הסכם</option><option>ללא הסכם מכירה</option><option>ממתין לספרים</option><option>אין שיתוף פעולה</option></select></div>
                <div><label className="block text-sm font-medium mb-1">איש קשר</label><input required type="text" value={editingSupplier.contact} onChange={e => setEditingSupplier({...editingSupplier, contact: e.target.value})} className="w-full p-2.5 md:p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 bg-slate-50" /></div>
                <div><label className="block text-sm font-medium mb-1">טלפון</label><input required type="text" value={editingSupplier.phone} onChange={e => setEditingSupplier({...editingSupplier, phone: e.target.value})} className="w-full p-2.5 md:p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 bg-slate-50" dir="ltr" /></div>
                <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium mt-4">שמור שינויים</button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit PR Copy Modal */}
      {isEditPrModalOpen && editingPr && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200" dir="rtl">
            <div className="p-4 md:p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-base md:text-lg text-slate-800">עדכון סטטוס יח"צ</h3>
              <button onClick={() => setIsEditPrModalOpen(false)} className="text-slate-400 hover:text-slate-600 bg-white p-1.5 rounded-md"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-4 md:p-5">
              <form onSubmit={handleEditPrSubmit} className="space-y-4">
                <div><label className="block text-sm font-medium mb-1">נמען</label><input type="text" value={editingPr.recipient} onChange={e => setEditingPr({...editingPr, recipient: e.target.value})} className="w-full p-2.5 md:p-2 border rounded-lg bg-slate-50" /></div>
                <div><label className="block text-sm font-medium mb-1">ספר נשלח</label><input type="text" value={editingPr.book} onChange={e => setEditingPr({...editingPr, book: e.target.value})} className="w-full p-2.5 md:p-2 border rounded-lg bg-slate-50" /></div>
                <div>
                  <label className="block text-sm font-medium mb-1">סטטוס מול המשפיען</label>
                  <select value={editingPr.status} onChange={e => setEditingPr({...editingPr, status: e.target.value})} className="w-full p-2.5 md:p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white">
                    <option>במשלוח</option><option>נמסר ליעד</option><option>פורסמה ביקורת</option><option>לא פורסם</option>
                  </select>
                </div>
                <button type="submit" className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 md:py-2.5 rounded-xl font-medium mt-2">עדכן נתונים</button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Add New Book Modal */}
      {isAddBookModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[95vh] md:max-h-[90vh]" dir="rtl">
            <div className="p-4 md:p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
              <h3 className="font-bold text-base md:text-lg text-slate-800">הוספת ספר חדש למלאי</h3>
              <button onClick={() => setIsAddBookModalOpen(false)} className="text-slate-400 hover:text-slate-600 bg-white p-1.5 rounded-md shadow-sm border border-slate-200"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-4 md:p-6 overflow-y-auto">
              <form onSubmit={handleAddBook} className="space-y-5 md:space-y-6">
                
                {/* מידע כללי */}
                <div>
                  <h4 className="font-bold text-sm md:text-base text-slate-700 mb-2 md:mb-3 border-b border-slate-100 pb-2">פרטי הספר</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    <div className="col-span-1 md:col-span-2"><label className="block text-xs md:text-sm font-medium mb-1">שם הספר</label><input required type="text" value={newBookForm.title} onChange={e => setNewBookForm({...newBookForm, title: e.target.value})} className="w-full p-2.5 md:p-2 border rounded-lg bg-slate-50 focus:bg-white" /></div>
                    <div><label className="block text-xs md:text-sm font-medium mb-1">מחבר</label><input required type="text" value={newBookForm.author} onChange={e => setNewBookForm({...newBookForm, author: e.target.value})} className="w-full p-2.5 md:p-2 border rounded-lg bg-slate-50" /></div>
                    <div><label className="block text-xs md:text-sm font-medium mb-1">דאנאק (ISBN)</label><input type="text" value={newBookForm.isbn} onChange={e => setNewBookForm({...newBookForm, isbn: e.target.value})} className="w-full p-2.5 md:p-2 border rounded-lg bg-slate-50" dir="ltr" /></div>
                    <div><label className="block text-xs md:text-sm font-medium mb-1">רף התראה (להדפסה חוזרת)</label><input required type="number" min="0" value={newBookForm.threshold} onChange={e => setNewBookForm({...newBookForm, threshold: Number(e.target.value)})} className="w-full p-2.5 md:p-2 border rounded-lg bg-slate-50" /></div>
                  </div>
                </div>

                {/* מהדורות הדפסה */}
                <div className="bg-indigo-50/50 p-3 md:p-4 rounded-xl border border-indigo-100">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-bold text-sm md:text-base text-indigo-900">מעקב מהדורות</h4>
                    <button type="button" onClick={() => handleAddEdition(setNewBookForm, newBookForm)} className="text-[10px] md:text-xs bg-white border border-indigo-200 text-indigo-700 px-2 md:px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-sm whitespace-nowrap"><Plus className="w-3 h-3" /> מהדורה נוספת</button>
                  </div>
                  <div className="space-y-2">
                    {newBookForm.editions.map((ed, idx) => (
                      <div key={idx} className="flex flex-wrap md:flex-nowrap gap-2 items-center bg-white p-2 rounded-lg border border-indigo-100">
                        <input required type="text" placeholder="שם המהדורה" value={ed.name} onChange={(e) => handleUpdateEdition(setNewBookForm, newBookForm, idx, 'name', e.target.value)} className="w-full md:flex-1 p-2 md:p-1.5 border border-slate-200 rounded text-sm focus:border-indigo-500 outline-none" />
                        <div className="flex items-center gap-2 w-full md:w-auto justify-between">
                            <span className="text-xs md:text-sm text-slate-500">כמות מודפסת:</span>
                            <div className="flex items-center gap-2">
                                <input required type="number" min="1" value={ed.printRun || ''} onChange={(e) => handleUpdateEdition(setNewBookForm, newBookForm, idx, 'printRun', e.target.value)} className="w-20 md:w-24 p-2 md:p-1.5 border border-slate-200 rounded text-sm focus:border-indigo-500 outline-none" dir="ltr" />
                                <button type="button" onClick={() => handleRemoveEdition(setNewBookForm, newBookForm, idx)} className="text-slate-400 hover:text-red-500 p-1 bg-slate-50 rounded md:bg-transparent"><X className="w-4 h-4 md:w-5 md:h-5" /></button>
                            </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* חלוקת מלאי עכשווית */}
                <div className="bg-emerald-50/50 p-3 md:p-4 rounded-xl border border-emerald-100">
                  <h4 className="font-bold text-sm md:text-base text-emerald-900 mb-2 md:mb-3 border-b border-emerald-100 pb-2">חלוקת מלאי נוכחית (פיזי)</h4>
                  
                  <div className="mb-4">
                    <label className="block text-xs md:text-sm font-medium text-slate-700 mb-1">ספרים בתוך מחסן ההוצאה:</label>
                    <input required type="number" min="0" value={newBookForm.publisherStock} onChange={e => setNewBookForm({...newBookForm, publisherStock: Number(e.target.value)})} className="w-full md:w-1/3 p-2.5 md:p-2 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 text-base md:text-lg font-bold text-emerald-700 bg-white" dir="ltr" />
                  </div>

                  <div className="flex justify-between items-center mb-2">
                    <h5 className="text-xs md:text-sm font-bold text-slate-700">פיזור במחסנים ורשתות:</h5>
                    <button type="button" onClick={handleAddBookBreakdownRow} className="text-[10px] md:text-xs bg-white border border-emerald-200 text-emerald-700 px-2 md:px-3 py-1.5 rounded-lg font-medium flex items-center gap-1 shadow-sm whitespace-nowrap"><Plus className="w-3 h-3" /> שייך לספק</button>
                  </div>
                  
                  {newBookForm.breakdown.length === 0 ? (
                    <p className="text-xs text-slate-500 bg-white p-2 rounded-lg border border-slate-200">לא נבחרו חנויות או ספקים.</p>
                  ) : (
                    <div className="space-y-2">
                      {newBookForm.breakdown.map((item, idx) => (
                        <div key={idx} className="flex flex-wrap md:flex-nowrap gap-2 items-center bg-white p-2 rounded-lg border border-emerald-100">
                          <select required value={item.supplier} onChange={(e) => handleUpdateBookBreakdownRow(idx, 'supplier', e.target.value)} className="w-full md:flex-1 p-2 border border-slate-200 rounded-md text-sm outline-none">
                            <option value="" disabled>-- בחר ספק מפיץ --</option>
                            {suppliersList.map(sup => <option key={sup.id} value={sup.name}>{sup.name}</option>)}
                          </select>
                          <div className="flex items-center gap-2 w-full md:w-auto justify-between">
                              <span className="text-xs md:text-sm text-slate-500">עותקים:</span>
                              <div className="flex items-center gap-2">
                                <input required type="number" min="1" value={item.amount || ''} onChange={(e) => handleUpdateBookBreakdownRow(idx, 'amount', e.target.value)} className="w-20 md:w-24 p-2 border border-slate-200 rounded-md text-sm outline-none" dir="ltr" />
                                <button type="button" onClick={() => handleRemoveBookBreakdownRow(idx)} className="text-slate-400 hover:text-red-500 p-1 bg-slate-50 rounded md:bg-transparent"><X className="w-4 h-4 md:w-5 md:h-5" /></button>
                              </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* מחירונים */}
                <div>
                  <h4 className="font-bold text-sm md:text-base text-slate-700 mb-2 md:mb-3 border-b border-slate-100 pb-2">מחירונים (₪)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div><label className="block text-xs font-medium text-slate-600 mb-1">מחיר לצרכן</label><input type="number" value={newBookForm.prices.general} onChange={e => setNewBookForm({...newBookForm, prices: {...newBookForm.prices, general: e.target.value}})} className="w-full p-2.5 md:p-2 border rounded-lg bg-slate-50" /></div>
                    <div><label className="block text-xs font-medium text-slate-600 mb-1">מחיר לחנויות</label><input type="number" value={newBookForm.prices.supplier} onChange={e => setNewBookForm({...newBookForm, prices: {...newBookForm.prices, supplier: e.target.value}})} className="w-full p-2.5 md:p-2 border rounded-lg bg-slate-50" /></div>
                    <div><label className="block text-xs font-medium text-slate-600 mb-1">מחיר מיוחד</label><input type="number" value={newBookForm.prices.yeshiva} onChange={e => setNewBookForm({...newBookForm, prices: {...newBookForm.prices, yeshiva: e.target.value}})} className="w-full p-2.5 md:p-2 border rounded-lg bg-slate-50" /></div>
                  </div>
                </div>

                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 md:py-3.5 rounded-xl font-bold mt-4 md:mt-6 shadow-sm">שמור פריט מלאי חדש</button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Existing Book Modal */}
      {isEditBookModalOpen && editingBook && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[95vh] md:max-h-[90vh]" dir="rtl">
            <div className="p-4 md:p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
              <h3 className="font-bold text-base md:text-lg text-slate-800">עריכת ספר: <span className="text-indigo-600 block md:inline text-sm md:text-lg truncate">{editingBook.title}</span></h3>
              <button onClick={() => {setIsEditBookModalOpen(false); setEditingBook(null);}} className="text-slate-400 hover:text-slate-600 bg-white p-1.5 rounded-md"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-4 md:p-6 overflow-y-auto">
              <form onSubmit={handleEditBookSubmit} className="space-y-5 md:space-y-6">
                
                {/* מידע כללי */}
                <div>
                   <h4 className="font-bold text-sm md:text-base text-slate-700 mb-2 md:mb-3 border-b border-slate-100 pb-2">פרטי הספר</h4>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                     <div className="col-span-1 md:col-span-2"><label className="block text-xs md:text-sm font-medium mb-1">שם הספר</label><input required type="text" value={editingBook.title} onChange={e => setEditingBook({...editingBook, title: e.target.value})} className="w-full p-2.5 md:p-2 border rounded-lg bg-slate-50" /></div>
                     <div><label className="block text-xs md:text-sm font-medium mb-1">מחבר</label><input required type="text" value={editingBook.author} onChange={e => setEditingBook({...editingBook, author: e.target.value})} className="w-full p-2.5 md:p-2 border rounded-lg bg-slate-50" /></div>
                     <div><label className="block text-xs md:text-sm font-medium mb-1">דאנאק</label><input type="text" value={editingBook.isbn} onChange={e => setEditingBook({...editingBook, isbn: e.target.value})} className="w-full p-2.5 md:p-2 border rounded-lg bg-slate-50" dir="ltr" /></div>
                     <div><label className="block text-xs md:text-sm font-medium mb-1">רף התראה (הדפסה)</label><input required type="number" min="0" value={editingBook.threshold} onChange={e => setEditingBook({...editingBook, threshold: Number(e.target.value)})} className="w-full p-2.5 md:p-2 border rounded-lg bg-slate-50" /></div>
                   </div>
                </div>

                {/* מהדורות הדפסה */}
                <div className="bg-indigo-50/50 p-3 md:p-4 rounded-xl border border-indigo-100">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-bold text-sm md:text-base text-indigo-900">מהדורות והדפסות</h4>
                    <button type="button" onClick={() => handleAddEdition(setEditingBook, editingBook)} className="text-[10px] md:text-xs bg-white border border-indigo-200 text-indigo-700 px-2 md:px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-sm whitespace-nowrap"><Plus className="w-3 h-3" /> הוסף</button>
                  </div>
                  <div className="space-y-2">
                    {editingBook.editions?.map((ed, idx) => (
                      <div key={idx} className="flex flex-wrap md:flex-nowrap gap-2 items-center bg-white p-2 rounded-lg border border-indigo-100">
                        <input required type="text" placeholder="שם מהדורה" value={ed.name} onChange={(e) => handleUpdateEdition(setEditingBook, editingBook, idx, 'name', e.target.value)} className="w-full md:flex-1 p-2 md:p-1.5 border border-slate-200 rounded text-sm outline-none" />
                        <div className="flex items-center gap-2 w-full md:w-auto justify-between">
                            <span className="text-xs md:text-sm text-slate-500">כמות:</span>
                            <div className="flex items-center gap-2">
                                <input required type="number" min="1" value={ed.printRun || ''} onChange={(e) => handleUpdateEdition(setEditingBook, editingBook, idx, 'printRun', e.target.value)} className="w-20 md:w-24 p-2 md:p-1.5 border border-slate-200 rounded text-sm outline-none" dir="ltr" />
                                <button type="button" onClick={() => handleRemoveEdition(setEditingBook, editingBook, idx)} className="text-slate-400 hover:text-red-500 p-1 bg-slate-50 rounded md:bg-transparent"><X className="w-4 h-4 md:w-5 md:h-5" /></button>
                            </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* חלוקת מלאי עכשווית */}
                <div className="bg-emerald-50/50 p-3 md:p-4 rounded-xl border border-emerald-100">
                  <h4 className="font-bold text-sm md:text-base text-emerald-900 mb-2 md:mb-3 border-b border-emerald-100 pb-2">חלוקת מלאי פיזי</h4>
                  
                  <div className="mb-4">
                    <label className="block text-xs md:text-sm font-medium text-slate-700 mb-1">כמות במחסן המרכזי:</label>
                    <input required type="number" min="0" value={editingBook.publisherStock} onChange={e => setEditingBook({...editingBook, publisherStock: Number(e.target.value)})} className="w-full md:w-1/3 p-2.5 md:p-2 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 text-base md:text-lg font-bold text-emerald-700 bg-white" dir="ltr" />
                  </div>

                  <div className="flex justify-between items-center mb-2">
                    <h5 className="text-xs md:text-sm font-bold text-slate-700">פיזור אצל ספקים:</h5>
                    <button type="button" onClick={handleEditBookBreakdownRow} className="text-[10px] md:text-xs bg-white border border-emerald-200 text-emerald-700 px-2 md:px-3 py-1.5 rounded-lg font-medium flex items-center gap-1 shadow-sm whitespace-nowrap"><Plus className="w-3 h-3" /> הוסף ספק</button>
                  </div>
                  
                  <div className="space-y-2">
                    {editingBook.breakdown.map((item, idx) => (
                      <div key={idx} className="flex flex-wrap md:flex-nowrap gap-2 items-center bg-white p-2 rounded-lg border border-emerald-100">
                        <select required value={item.supplier} onChange={(e) => handleUpdateEditBookBreakdownRow(idx, 'supplier', e.target.value)} className="w-full md:flex-1 p-2 border border-slate-200 rounded-md text-sm outline-none">
                          <option value="" disabled>-- בחר ספק --</option>
                          {suppliersList.map(sup => <option key={sup.id} value={sup.name}>{sup.name}</option>)}
                        </select>
                        <div className="flex items-center gap-2 w-full md:w-auto justify-between">
                            <span className="text-xs md:text-sm text-slate-500">עותקים:</span>
                            <div className="flex items-center gap-2">
                                <input required type="number" min="1" value={item.amount || ''} onChange={(e) => handleUpdateEditBookBreakdownRow(idx, 'amount', e.target.value)} className="w-20 md:w-24 p-2 border border-slate-200 rounded-md text-sm outline-none" dir="ltr" />
                                <button type="button" onClick={() => handleRemoveEditBookBreakdownRow(idx)} className="text-slate-400 hover:text-red-500 p-1 bg-slate-50 rounded md:bg-transparent"><X className="w-4 h-4 md:w-5 md:h-5" /></button>
                            </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* מחירונים עריכה */}
                <div>
                   <h4 className="font-bold text-sm md:text-base text-slate-700 mb-2 md:mb-3 border-b border-slate-100 pb-2">מחירונים (₪)</h4>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                     <div><label className="block text-xs font-medium text-slate-600 mb-1">מחיר כללי</label><input required type="number" min="0" value={editingBook.prices.general} onChange={e => setEditingBook({...editingBook, prices: {...editingBook.prices, general: Number(e.target.value)}})} className="w-full p-2.5 md:p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500" dir="ltr" /></div>
                     <div><label className="block text-xs font-medium text-slate-600 mb-1">מחיר ספק</label><input required type="number" min="0" value={editingBook.prices.supplier} onChange={e => setEditingBook({...editingBook, prices: {...editingBook.prices, supplier: Number(e.target.value)}})} className="w-full p-2.5 md:p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500" dir="ltr" /></div>
                     <div><label className="block text-xs font-medium text-slate-600 mb-1">מחיר ישיבות</label><input required type="number" min="0" value={editingBook.prices.yeshiva} onChange={e => setEditingBook({...editingBook, prices: {...editingBook.prices, yeshiva: Number(e.target.value)}})} className="w-full p-2.5 md:p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500" dir="ltr" /></div>
                   </div>
                </div>

                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 md:py-3 rounded-xl font-bold mt-4 md:mt-6 shadow-sm">עדכן וסיים</button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Manual Stock Update Modal */}
      {isUpdateStockModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200" dir="rtl">
            <div className="p-4 md:p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-base md:text-lg text-slate-800">עדכון מלאי ידני</h3>
              <button onClick={() => setIsUpdateStockModalOpen(false)} className="text-slate-400 hover:text-slate-600 bg-white p-1.5 rounded-md shadow-sm border border-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 md:p-6">
              <form onSubmit={handleManualStockUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">בחר ספר (מעדכן את מחסן ההוצאה)</label>
                  <select 
                    required 
                    value={stockUpdateForm.bookId} 
                    onChange={e => setStockUpdateForm({...stockUpdateForm, bookId: e.target.value})}
                    className="w-full p-2.5 md:p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-slate-50 text-sm"
                  >
                    <option value="" disabled>-- בחר מספרייה --</option>
                    {inventoryList.map(book => (
                      <option key={book.id} value={book.id}>{book.title} (במחסן ההוצאה: {book.publisherStock})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">כמות לעדכון</label>
                  <input 
                    required 
                    type="number" 
                    value={stockUpdateForm.amount} 
                    onChange={e => setStockUpdateForm({...stockUpdateForm, amount: e.target.value})}
                    className="w-full p-2.5 md:p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                    placeholder="למשל: 50 או -20"
                    dir="ltr"
                  />
                  <p className="text-xs text-slate-400 mt-1">הזן מספר חיובי להוספה למלאי, או שלילי להחסרה מ"מחסן ההוצאה".</p>
                </div>
                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-medium mt-2 md:mt-4">
                  עדכן מלאי
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
