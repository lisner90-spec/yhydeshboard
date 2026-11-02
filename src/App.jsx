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
  Trash2
} from 'lucide-react';

// --- Mock Data ---
const getDashboardStats = (period) => {
  if (period === 'monthly') {
    return [
      { id: 1, title: 'ספרים בהפקה', value: '12', icon: PenTool, color: 'text-blue-600', bgColor: 'bg-blue-100' },
      { id: 2, title: 'ספרים שהושלמו', value: '145', icon: BookOpen, color: 'text-indigo-600', bgColor: 'bg-indigo-100' },
      { id: 3, title: 'נמכרו החודש (עותקים)', value: '3,240', icon: Package, color: 'text-emerald-600', bgColor: 'bg-emerald-100' },
      { id: 4, title: 'רווח מכירות חודשי (₪)', value: '₪142,500', icon: DollarSign, color: 'text-green-600', bgColor: 'bg-green-100' },
      { id: 5, title: 'מגמת מכירות (חודשי)', value: '+18.5%', icon: TrendingUp, color: 'text-purple-600', bgColor: 'bg-purple-100' },
      { id: 6, title: 'התראות מלאי נמוך', value: '3', icon: AlertTriangle, color: 'text-amber-600', bgColor: 'bg-amber-100' }
    ];
  } else {
    return [
      { id: 1, title: 'ספרים בהפקה', value: '12', icon: PenTool, color: 'text-blue-600', bgColor: 'bg-blue-100' },
      { id: 2, title: 'ספרים שהושלמו (השנה)', value: '34', icon: BookOpen, color: 'text-indigo-600', bgColor: 'bg-indigo-100' },
      { id: 3, title: 'נמכרו השנה (עותקים)', value: '38,500', icon: Package, color: 'text-emerald-600', bgColor: 'bg-emerald-100' },
      { id: 4, title: 'רווח מכירות שנתי (₪)', value: '₪1,750,000', icon: DollarSign, color: 'text-green-600', bgColor: 'bg-green-100' },
      { id: 5, title: 'גידול שנתי במכירות', value: '+42.3%', icon: TrendingUp, color: 'text-purple-600', bgColor: 'bg-purple-100' },
      { id: 6, title: 'התראות מלאי נמוך', value: '3', icon: AlertTriangle, color: 'text-amber-600', bgColor: 'bg-amber-100' }
    ];
  }
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
    id: 1, title: 'המדריך השלם לבינה מלאכותית', author: 'עמית שרון', isbn: '978-965-123-456-7', stock: 1250, threshold: 200, 
    prices: { general: 110, supplier: 55, yeshiva: 70 },
    breakdown: [
      { supplier: 'מחסן ראשי - פתח תקווה', amount: 800 },
      { supplier: 'צומת ספרים - מרלו"ג', amount: 250 },
      { supplier: 'סטימצקי - הפצה', amount: 200 }
    ]
  },
  { 
    id: 2, title: 'שירת הים (מהדורה 1)', author: 'דוד אלמגור', isbn: '978-965-987-654-3', stock: 45, threshold: 100, 
    prices: { general: 88, supplier: 44, yeshiva: 60 },
    breakdown: [
      { supplier: 'מחסן ראשי - פתח תקווה', amount: 15 },
      { supplier: 'חנויות עצמאיות (הפצה מרוכזת)', amount: 30 }
    ]
  },
  { 
    id: 3, title: 'סודות המטבח האיטלקי', author: 'מיכל אהרוני', isbn: '978-965-456-789-0', stock: 850, threshold: 150, 
    prices: { general: 120, supplier: 60, yeshiva: 80 },
    breakdown: [
      { supplier: 'מחסן ראשי - פתח תקווה', amount: 400 },
      { supplier: 'צומת ספרים - מרלו"ג', amount: 300 },
      { supplier: 'סטימצקי - הפצה', amount: 150 }
    ]
  },
  { 
    id: 4, title: 'כלכלת המחר', author: 'פרופ׳ יצחק לוי', isbn: '978-965-321-098-7', stock: 12, threshold: 50, 
    prices: { general: 95, supplier: 47, yeshiva: 65 },
    breakdown: [
      { supplier: 'מחסן ראשי - פתח תקווה', amount: 12 }
    ]
  },
  { 
    id: 5, title: 'אגדות היער השחור', author: 'נועה ברק', isbn: '978-965-741-852-9', stock: 420, threshold: 100, 
    prices: { general: 74, supplier: 37, yeshiva: 50 },
    breakdown: [
      { supplier: 'מחסן ראשי - פתח תקווה', amount: 200 },
      { supplier: 'צומת ספרים - מרלו"ג', amount: 120 },
      { supplier: 'חנויות עצמאיות (הפצה מרוכזת)', amount: 100 }
    ]
  },
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

  // --- New States for Search, Suppliers and Modals ---
  const [searchQuery, setSearchQuery] = useState('');
  const [inventoryList, setInventoryList] = useState(initialInventory);
  const [suppliersList, setSuppliersList] = useState(suppliers);
  const [isAddSupplierModalOpen, setIsAddSupplierModalOpen] = useState(false);
  const [newSupplier, setNewSupplier] = useState({ name: '', type: 'רשת קמעונאית', contact: '', phone: '', email: '', status: 'פעיל - יש הסכם' });
  const [selectedSupplierForStock, setSelectedSupplierForStock] = useState(null);

  // --- Inventory Modals (Add, Edit, Update) ---
  const [isUpdateStockModalOpen, setIsUpdateStockModalOpen] = useState(false);
  const [stockUpdateForm, setStockUpdateForm] = useState({ bookId: '', amount: 0 });
  
  const initialBookFormState = {
    title: '', author: '', isbn: '', stock: 0, threshold: 50,
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

  const handleExportCSV = () => {
    const headers = ['שם הספר', 'מחבר', 'דאנאק', 'סה"כ במלאי'];
    const rows = inventoryList.map(b => [b.title, b.author, b.isbn, b.stock]);
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(','), ...rows.map(e => e.join(','))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "inventory_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleManualStockUpdate = (e) => {
    e.preventDefault();
    const amount = Number(stockUpdateForm.amount);
    if (!stockUpdateForm.bookId || isNaN(amount)) return;
    
    setInventoryList(inventoryList.map(book => 
      book.id.toString() === stockUpdateForm.bookId 
        ? { ...book, stock: Math.max(0, book.stock + amount) } 
        : book
    ));
    
    setIsUpdateStockModalOpen(false);
    setStockUpdateForm({ bookId: '', amount: 0 });
  };

  // Add Book Handlers
  const handleAddBook = (e) => {
    e.preventDefault();
    const newBook = {
      ...newBookForm,
      id: Date.now(),
    };
    setInventoryList([...inventoryList, newBook]);
    setIsAddBookModalOpen(false);
    setNewBookForm(initialBookFormState);
  };

  const handleAddBookBreakdownRow = () => {
    setNewBookForm({
      ...newBookForm,
      breakdown: [...newBookForm.breakdown, { supplier: '', amount: 0 }]
    });
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
    // Deep copy to prevent mutating state directly during typing
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
    setEditingBook({
      ...editingBook,
      breakdown: [...editingBook.breakdown, { supplier: '', amount: 0 }]
    });
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

  const handleAddSupplier = (e) => {
    e.preventDefault();
    setSuppliersList([...suppliersList, { ...newSupplier, id: Date.now() }]);
    setIsAddSupplierModalOpen(false);
    setNewSupplier({ name: '', type: 'רשת קמעונאית', contact: '', phone: '', email: '', status: 'פעיל - יש הסכם' });
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

    const updatedTask = {
      ...selectedTask,
      invoices: [...selectedTask.invoices, { id: Date.now(), desc: newInvoice.desc, amount: Number(newInvoice.amount), receiptFile: null }]
    };

    const updatedTasks = {
      ...tasks,
      [taskColumn]: tasks[taskColumn].map(t => t.id === selectedTask.id ? updatedTask : t)
    };

    setTasks(updatedTasks);
    setSelectedTask(updatedTask);
    setNewInvoice({ desc: '', amount: '' });
  };

  const handleInvoiceReceiptUpload = (invoiceId) => {
    const updatedTask = {
      ...selectedTask,
      invoices: selectedTask.invoices.map(inv =>
        inv.id === invoiceId ? { ...inv, receiptFile: 'אסמכתא_הועלתה.pdf' } : inv
      )
    };
    const updatedTasks = {
      ...tasks,
      [taskColumn]: tasks[taskColumn].map(t => t.id === selectedTask.id ? updatedTask : t)
    };
    setTasks(updatedTasks);
    setSelectedTask(updatedTask);
  };

  const handleFileUpload = (type) => {
    let fileName = 'קובץ_הועלה.pdf';
    if (type === 'coverFile') fileName = 'new_cover_uploaded.jpg';
    else if (type === 'bookFile') fileName = 'book_manuscript_v2.pdf';
    else if (type === 'dedicationFile') fileName = 'dedications_list.docx';
    
    const updatedTask = {
      ...selectedTask,
      [type]: fileName
    };
    const updatedTasks = {
      ...tasks,
      [taskColumn]: tasks[taskColumn].map(t => t.id === selectedTask.id ? updatedTask : t)
    };
    setTasks(updatedTasks);
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
          <h1 className="text-2xl font-bold text-slate-800 mb-2">מערכת ניהול הוצאה לאור</h1>
          <p className="text-slate-500 mb-6">הזן פרטי התחברות כדי לגשת למערכת</p>
          
          <form onSubmit={handleLogin} className="space-y-4 text-right">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">שם משתמש</label>
              <input 
                type="text" 
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50 focus:bg-white text-sm"
                dir="ltr"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">סיסמה</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50 focus:bg-white text-sm"
                dir="ltr"
              />
            </div>
            
            {loginError && (
              <div className="text-red-500 text-sm bg-red-50 p-2 rounded-lg text-center font-medium">
                {loginError}
              </div>
            )}

            <button 
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-xl font-medium transition-colors shadow-sm mt-2"
            >
              התחבר למערכת
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="flex h-screen w-full bg-slate-50 text-slate-800 font-sans overflow-hidden">
      
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 right-0 z-50 w-64 bg-white border-l border-slate-200 flex flex-col shadow-2xl transform transition-transform duration-300 md:relative md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'} print:hidden`}>
        <div className="p-6 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <BookOpen className="text-white w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">הוצאה לאור</h1>
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-slate-400 hover:text-slate-600">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-sm' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-slate-100 text-sm text-slate-400 text-center">
          מערכת ניהול © 2026
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="bg-white p-4 md:p-6 shadow-sm border-b border-slate-200 flex justify-between items-center z-10 print:hidden">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden text-slate-500 hover:text-slate-700 p-1"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-lg md:text-2xl font-bold text-slate-800 truncate">
              {navItems.find(item => item.id === activeTab)?.label}
            </h2>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <div className="hidden md:block text-sm text-slate-500">
              שלום, <span className="font-semibold text-slate-700">{currentUserName}</span>
            </div>
            <button 
              onClick={() => {
                setUserRole(null);
                setCurrentUserName('');
                setUsername('');
                setPassword('');
                setLoginError('');
              }}
              className="text-xs md:text-sm font-medium text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1.5 md:px-3 md:py-1.5 rounded-lg transition-colors border border-transparent"
            >
              התנתק
            </button>
            <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-sm md:text-base ${
              userRole === 'admin' ? 'bg-indigo-100 border-2 border-indigo-200 text-indigo-700' : 'bg-slate-100 border-2 border-slate-200 text-slate-600'
            }`}>
              {userRole === 'admin' ? 'מ' : 'צ'}
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="flex-1 p-4 md:p-8 overflow-y-auto">
          
          {/* DASHBOARD VIEW */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 md:space-y-8 animate-in fade-in duration-300">
              {/* Dashboard Header & Toggle */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h3 className="text-lg md:text-xl font-bold text-slate-800">סיכום נתונים</h3>
                <div className="bg-slate-200/60 p-1 rounded-xl flex items-center border border-slate-200 w-full sm:w-auto">
                  <button 
                    onClick={() => setDashboardPeriod('monthly')} 
                    className={`flex-1 sm:flex-none px-4 md:px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-center ${dashboardPeriod === 'monthly' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-800'}`}
                  >
                    סיכום חודשי
                  </button>
                  <button 
                    onClick={() => setDashboardPeriod('yearly')} 
                    className={`flex-1 sm:flex-none px-4 md:px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-center ${dashboardPeriod === 'yearly' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-800'}`}
                  >
                    סיכום שנתי
                  </button>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {getDashboardStats(dashboardPeriod).map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.id} className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-slate-100 flex items-center gap-4 transition-transform hover:-translate-y-1">
                      <div className={`p-3 md:p-4 rounded-xl ${stat.bgColor} ${stat.color}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-xs md:text-sm font-medium text-slate-500 mb-1">{stat.title}</p>
                        <h3 className="text-xl md:text-2xl font-bold text-slate-800">{stat.value}</h3>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Recent Activity Mock Section */}
              <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-slate-100">
                <h3 className="text-base md:text-lg font-bold text-slate-800 mb-4">פעילות אחרונה</h3>
                <div className="space-y-4">
                  {[
                    { text: 'כתב היד "סודות המטבח האיטלקי" עבר משלב הלקטורה לעריכה.', time: 'לפני שעתיים' },
                    { text: 'הוזמנה מהדורה שנייה של "שירת הים" מבית הדפוס.', time: 'לפני 4 שעות' },
                    { text: 'אושר עיצוב הכריכה של "כלכלת המחר".', time: 'אתמול' }
                  ].map((activity, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-slate-50 last:border-0 gap-2">
                      <div className="flex items-start sm:items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-indigo-400 mt-2 sm:mt-0 flex-shrink-0"></div>
                        <p className="text-sm md:text-base text-slate-700">{activity.text}</p>
                      </div>
                      <span className="text-xs md:text-sm text-slate-400 font-mono pr-5 sm:pr-0">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* PRODUCTION (KANBAN) VIEW */}
          {activeTab === 'production' && (
            <div className="flex flex-col h-full animate-in fade-in duration-300">
              {userRole === 'admin' && (
                <div className="flex justify-end mb-4">
                  <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-2">
                    <Plus className="w-4 h-4" /> הוסף פרויקט הפקה חדש
                  </button>
                </div>
              )}
              <div className="flex gap-4 md:gap-6 h-full min-h-[450px] overflow-x-auto pb-4 snap-x">
                {kanbanColumns.map((col) => {
                  const Icon = col.icon;
                  return (
                    <div key={col.id} className={`snap-center flex-1 min-w-[280px] md:min-w-[320px] rounded-2xl border ${col.color} p-4 flex flex-col`}>
                      <div className="flex items-center gap-2 mb-4">
                        <Icon className="w-5 h-5 text-slate-600" />
                        <h3 className="font-bold text-slate-700">{col.title}</h3>
                      </div>
                      <div className="flex-1 space-y-3">
                        {tasks[col.id].map((task) => {
                          const totalExpenses = task.invoices.reduce((sum, inv) => sum + inv.amount, 0);
                          const filesCount = (task.coverFile ? 1 : 0) + (task.bookFile ? 1 : 0) + (task.dedicationFile ? 1 : 0);
                          
                          return (
                            <div 
                              key={task.id} 
                              onClick={() => { setSelectedTask(task); setTaskColumn(col.id); }}
                              className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all hover:border-indigo-200 cursor-pointer group"
                            >
                              <h4 className="font-bold text-slate-800 mb-1 group-hover:text-indigo-600 transition-colors">{task.title}</h4>
                              <p className="text-sm text-slate-500 mb-3">מאת: {task.author}</p>
                              
                              <div className="flex flex-wrap gap-2 mb-3">
                                {filesCount > 0 && (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-1 rounded-md">
                                    <Paperclip className="w-3 h-3" />
                                    {filesCount} קבצים
                                  </span>
                                )}
                                {totalExpenses > 0 && (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-red-50 text-red-600 px-2 py-1 rounded-md">
                                    <DollarSign className="w-3 h-3" />
                                    ₪{totalExpenses.toLocaleString()} הוצאות
                                  </span>
                                )}
                              </div>

                              <div className="flex justify-between items-center text-xs text-slate-400 mt-2 pt-3 border-t border-slate-50">
                                <span>יעד סיום:</span>
                                <span className="bg-slate-50 px-2 py-1 rounded-md text-slate-600">{task.date}</span>
                              </div>
                            </div>
                          );
                        })}
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
              <div className="p-4 md:p-6 border-b border-slate-100 flex flex-col gap-4">
                <h3 className="text-lg font-bold text-slate-800">מצב מלאי מחסנים ורשתות</h3>
                
                {/* Search & Actions Bar */}
                <div className="flex flex-col xl:flex-row gap-3 xl:items-center justify-between">
                  <div className="relative w-full xl:w-96 print:hidden">
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="חיפוש לפי שם ספר, מחבר או דאנאק..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="block w-full pr-10 pl-3 py-2.5 border border-slate-200 rounded-xl leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 md:flex md:flex-row gap-2 md:gap-3 w-full xl:w-auto print:hidden">
                    <button 
                      onClick={() => window.print()} 
                      className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-3 py-2.5 rounded-lg font-medium text-xs md:text-sm transition-colors flex items-center justify-center gap-2"
                    >
                      <Printer className="w-4 h-4" />
                      הדפס
                    </button>
                    <button 
                      onClick={handleExportCSV}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2.5 rounded-lg font-medium text-xs md:text-sm transition-colors flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      ייצוא
                    </button>
                    {userRole === 'admin' && (
                      <>
                        <button 
                          onClick={() => setIsUpdateStockModalOpen(true)}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2.5 rounded-lg font-medium text-xs md:text-sm transition-colors flex items-center justify-center gap-2"
                        >
                          <RefreshCw className="w-4 h-4" />
                          עדכון ידני
                        </button>
                        <button 
                          onClick={() => setIsAddBookModalOpen(true)}
                          className="col-span-2 md:col-span-1 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2.5 rounded-lg font-medium text-xs md:text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
                        >
                          <Plus className="w-4 h-4" />
                          הוסף ספר חדש
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-right min-w-[900px]">
                  <thead className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
                    <tr>
                      <th className="py-4 px-4 md:px-6 font-medium whitespace-nowrap">שם הספר</th>
                      <th className="py-4 px-4 md:px-6 font-medium">מחבר / דאנאק</th>
                      <th className="py-4 px-4 md:px-6 font-medium">מחירון (כללי / ספק / ישיבה)</th>
                      <th className="py-4 px-4 md:px-6 font-medium text-center">סה"כ במלאי</th>
                      <th className="py-4 px-4 md:px-6 font-medium">פירוט לפי ספק/מחסן</th>
                      <th className="py-4 px-4 md:px-6 font-medium text-center">סטטוס</th>
                      {userRole === 'admin' && (
                        <th className="py-4 px-4 md:px-6 font-medium text-center print:hidden">פעולות</th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredInventory.map((book) => {
                      const isLowStock = book.stock <= book.threshold;
                      return (
                        <tr key={book.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-4 px-4 md:px-6 font-medium text-slate-800">{book.title}</td>
                          <td className="py-4 px-4 md:px-6 text-slate-600">
                            <div className="whitespace-nowrap">{book.author}</div>
                            <div className="text-slate-400 font-mono text-xs mt-1">{book.isbn}</div>
                          </td>
                          <td className="py-4 px-4 md:px-6 text-slate-600">
                            <div className="flex flex-col gap-1 text-sm bg-white border border-slate-100 rounded-lg p-2 shadow-sm min-w-[120px]">
                              <div className="flex justify-between gap-2"><span className="text-slate-400 text-xs mt-0.5">כללי:</span> <span className="font-semibold text-slate-700">₪{book.prices.general}</span></div>
                              <div className="flex justify-between gap-2 border-t border-slate-50 pt-1"><span className="text-slate-400 text-xs mt-0.5">ספק:</span> <span className="font-medium text-indigo-600">₪{book.prices.supplier}</span></div>
                              <div className="flex justify-between gap-2 border-t border-slate-50 pt-1"><span className="text-slate-400 text-xs mt-0.5">ישיבות:</span> <span className="font-medium text-emerald-600">₪{book.prices.yeshiva}</span></div>
                            </div>
                          </td>
                          <td className="py-4 px-4 md:px-6 font-bold text-slate-700 text-lg text-center">{book.stock.toLocaleString()}</td>
                          <td className="py-4 px-4 md:px-6">
                            <div className="flex flex-col gap-1.5 min-w-[180px]">
                              {book.breakdown.length > 0 ? book.breakdown.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center text-xs md:text-sm border-b border-slate-100/50 pb-1 last:border-0 last:pb-0 gap-2">
                                  <span className="text-slate-500 truncate">{item.supplier}</span>
                                  <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-xs">{item.amount.toLocaleString()}</span>
                                </div>
                              )) : (
                                <span className="text-xs text-slate-400">לא משויך לספקים</span>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-4 md:px-6 text-center">
                            {isLowStock ? (
                              <span className="inline-flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] md:text-xs font-medium bg-red-100 text-red-700 border border-red-200 whitespace-nowrap">
                                <AlertTriangle className="w-3 h-3 md:w-3.5 md:h-3.5" />
                                דורש הדפסה
                              </span>
                            ) : (
                              <span className="inline-flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] md:text-xs font-medium bg-emerald-100 text-emerald-700 border border-emerald-200 whitespace-nowrap">
                                <CheckCircle className="w-3 h-3 md:w-3.5 md:h-3.5" />
                                תקין
                              </span>
                            )}
                          </td>
                          {userRole === 'admin' && (
                            <td className="py-4 px-4 md:px-6 text-center print:hidden flex items-center justify-center gap-1">
                              <button 
                                onClick={() => openEditBook(book)} 
                                className="text-slate-400 hover:text-indigo-600 p-2 rounded-lg hover:bg-indigo-50 transition-colors"
                                title="ערוך ספר"
                              >
                                <Edit className="w-4 h-4 md:w-5 md:h-5" />
                              </button>
                              <button 
                                onClick={() => handleDeleteBook(book.id)} 
                                className="text-slate-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-colors"
                                title="מחק ספר"
                              >
                                <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                              </button>
                            </td>
                          )}
                        </tr>
                      );
                    })}
                    {filteredInventory.length === 0 && (
                      <tr>
                        <td colSpan={userRole === 'admin' ? 7 : 6} className="py-12 text-center text-slate-500">
                          <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                          <p className="text-base font-medium">לא נמצאו ספרים תואמים לחיפוש.</p>
                        </td>
                      </tr>
                    )}
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
                  <button 
                    onClick={() => setIsAddSupplierModalOpen(true)}
                    className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg font-medium text-sm transition-colors flex justify-center items-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> הוסף ספק חדש
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                {suppliersList.map((supplier) => (
                  <div key={supplier.id} className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-bold text-base md:text-lg text-slate-800">{supplier.name}</h4>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="inline-block px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-md">
                            {supplier.type}
                          </span>
                          <span className={`inline-block px-2.5 py-1 text-xs font-medium rounded-md border ${getStatusColor(supplier.status)}`}>
                            {supplier.status}
                          </span>
                        </div>
                      </div>
                      <div className="bg-slate-50 p-2 rounded-lg shrink-0 mr-2">
                        {supplier.type === 'בית דפוס' ? <Printer className="w-5 h-5 text-slate-400" /> : 
                         supplier.type === 'מחסן לוגיסטי' ? <Package className="w-5 h-5 text-slate-400" /> : 
                         <Store className="w-5 h-5 text-slate-400" />}
                      </div>
                    </div>
                    
                    <div className="space-y-3 pt-4 border-t border-slate-100 flex-1">
                      <div className="flex items-center gap-3 text-sm text-slate-600">
                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center flex-shrink-0">
                          <Users className="w-4 h-4 text-slate-400" />
                        </div>
                        <div>
                          <p className="text-[10px] md:text-xs text-slate-400">איש קשר</p>
                          <p className="font-medium text-slate-700 text-sm">{supplier.contact}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 text-sm text-slate-600">
                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center flex-shrink-0">
                          <Phone className="w-4 h-4 text-slate-400" />
                        </div>
                        <div>
                          <p className="text-[10px] md:text-xs text-slate-400">טלפון</p>
                          <p className="font-medium text-slate-700 text-sm" dir="ltr">{supplier.phone}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-sm text-slate-600">
                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center flex-shrink-0">
                          <FileText className="w-4 h-4 text-slate-400" />
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-[10px] md:text-xs text-slate-400">דוא״ל</p>
                          <p className="font-medium text-slate-700 text-sm truncate">{supplier.email}</p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-5 mt-4 border-t border-slate-50">
                      <button 
                        onClick={() => setSelectedSupplierForStock(supplier)}
                        className="w-full flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-700 py-2.5 rounded-lg text-sm font-medium transition-colors"
                      >
                        <Package className="w-4 h-4" />
                        צפה במלאי
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MARKETING AND PR VIEW */}
          {activeTab === 'marketing' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-300">
              
              {/* Marketing Campaigns */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col">
                <div className="p-4 md:p-6 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="text-base md:text-lg font-bold text-slate-800 flex items-center gap-2">
                    <Megaphone className="w-5 h-5 text-indigo-600" />
                    תקציבי קמפיינים
                  </h3>
                  {userRole === 'admin' && (
                    <button className="text-xs md:text-sm font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg">
                      + הוסף
                    </button>
                  )}
                </div>
                <div className="p-4 md:p-6 space-y-6">
                  {marketingData.campaigns.map(camp => {
                    const progress = (camp.spent / camp.budget) * 100;
                    return (
                      <div key={camp.id} className="space-y-2">
                        <div className="flex justify-between items-start gap-2">
                          <div className="overflow-hidden">
                            <div className="font-bold text-sm md:text-base text-slate-700 truncate">{camp.name}</div>
                            <div className="text-xs text-slate-500 truncate">{camp.book}</div>
                          </div>
                          <div className="text-[10px] md:text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded shrink-0">
                            החזר: {camp.roas}
                          </div>
                        </div>
                        <div className="flex justify-between text-xs md:text-sm">
                          <span className="text-slate-500">נוצל: ₪{camp.spent.toLocaleString()}</span>
                          <span className="text-slate-700 font-medium">מתוך ₪{camp.budget.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2">
                          <div className={`h-2 rounded-full ${progress > 90 ? 'bg-red-500' : 'bg-indigo-500'}`} style={{ width: `${progress}%` }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* PR & Review Copies */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col">
                <div className="p-4 md:p-6 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="text-base md:text-lg font-bold text-slate-800 flex items-center gap-2">
                    <Share2 className="w-5 h-5 text-pink-500" />
                    עותקי סיקור ויח"צ
                  </h3>
                </div>
                <div className="p-0 flex-1 overflow-x-auto">
                  <table className="w-full text-right text-sm min-w-[400px]">
                    <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4 font-medium">נמען / משפיען</th>
                        <th className="py-3 px-4 font-medium">ספר נשלח</th>
                        <th className="py-3 px-4 font-medium text-center">סטטוס</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {marketingData.prCopies.map(pr => (
                        <tr key={pr.id} className="hover:bg-slate-50">
                          <td className="py-3 px-4 font-medium text-slate-700">{pr.recipient}</td>
                          <td className="py-3 px-4 text-slate-500">{pr.book}</td>
                          <td className="py-3 px-4 text-center">
                            <span className={`inline-flex px-2 py-1 rounded-md text-[10px] md:text-xs font-medium ${
                              pr.status === 'פורסמה ביקורת' ? 'bg-emerald-100 text-emerald-700' : 
                              pr.status === 'נמסר ליעד' ? 'bg-blue-100 text-blue-700' : 
                              'bg-amber-100 text-amber-700'
                            }`}>
                              {pr.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* INTEGRATIONS AND AUTOMATION VIEW */}
          {activeTab === 'integrations' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-slate-800">אינטגרציות ומערכות</h3>
                  <p className="text-slate-500 text-xs md:text-sm mt-1">חיבור אוטומטי למערכות הפקת חשבוניות וחנויות</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {integrations.map((int) => (
                  <div key={int.id} className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-slate-800 text-white flex items-center justify-center text-lg md:text-xl font-bold">
                        {int.logo}
                      </div>
                      <div className="flex flex-col items-end gap-1.5">
                        <button 
                          onClick={() => handleToggleIntegration(int.id)}
                          disabled={userRole !== 'admin'}
                          className={`w-10 md:w-12 h-5 md:h-6 rounded-full transition-colors relative focus:outline-none ${int.connected ? 'bg-emerald-500' : 'bg-slate-300'} ${userRole !== 'admin' && 'opacity-70 cursor-not-allowed'}`}
                        >
                          <span className={`absolute top-0.5 md:top-1 bg-white w-4 h-4 rounded-full transition-all shadow-sm ${int.connected ? 'left-1' : 'right-1'}`} />
                        </button>
                        <span className={`text-[10px] md:text-xs font-medium ${int.connected ? 'text-emerald-600' : 'text-slate-400'}`}>
                          {int.connected ? 'מחובר' : 'מנותק'}
                        </span>
                      </div>
                    </div>
                    
                    <h4 className="text-base md:text-lg font-bold text-slate-800">{int.name}</h4>
                    <p className="text-xs md:text-sm text-slate-500 mb-6">{int.type}</p>
                    
                    <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                      <div className="text-[10px] md:text-xs text-slate-400">
                        סנכרון אחרון:<br/><span className="text-slate-600 font-medium">{int.lastSync}</span>
                      </div>
                      <button 
                        onClick={() => handleSync(int.id)}
                        disabled={!int.connected || isSyncing === int.id || userRole !== 'admin'}
                        className={`flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-colors ${
                          !int.connected || userRole !== 'admin' ? 'bg-slate-50 text-slate-400 cursor-not-allowed' : 
                          'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                        }`}
                      >
                        <RefreshCw className={`w-3.5 h-3.5 md:w-4 md:h-4 ${isSyncing === int.id ? 'animate-spin' : ''}`} />
                        סנכרן
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>

      {/* --- MODALS --- */}
      
      {/* Add Supplier Modal */}
      {isAddSupplierModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in slide-in-from-bottom-4 sm:slide-in-from-bottom-0 sm:fade-in sm:zoom-in-95 duration-200 max-h-[90vh] flex flex-col" dir="rtl">
            <div className="p-4 md:p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
              <h3 className="font-bold text-base md:text-lg text-slate-800">הוספת ספק / רשת</h3>
              <button onClick={() => setIsAddSupplierModalOpen(false)} className="text-slate-400 hover:text-slate-600 bg-white p-1.5 rounded-md shadow-sm border border-slate-200 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-y-auto p-4 md:p-6">
              <form onSubmit={handleAddSupplier} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">שם הספק/רשת</label>
                  <input required type="text" value={newSupplier.name} onChange={e => setNewSupplier({...newSupplier, name: e.target.value})} className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-slate-50 focus:bg-white text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">סוג ספק</label>
                  <select value={newSupplier.type} onChange={e => setNewSupplier({...newSupplier, type: e.target.value})} className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-slate-50 focus:bg-white text-sm">
                    <option>רשת קמעונאית</option>
                    <option>הפצה</option>
                    <option>מחסן לוגיסטי</option>
                    <option>בית דפוס</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">סטטוס שיתוף פעולה</label>
                  <select value={newSupplier.status} onChange={e => setNewSupplier({...newSupplier, status: e.target.value})} className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-slate-50 focus:bg-white text-sm">
                    <option>פעיל - יש הסכם</option>
                    <option>ללא הסכם מכירה</option>
                    <option>ממתין לספרים</option>
                    <option>אין שיתוף פעולה</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">איש קשר</label>
                  <input required type="text" value={newSupplier.contact} onChange={e => setNewSupplier({...newSupplier, contact: e.target.value})} className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-slate-50 focus:bg-white text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">טלפון</label>
                  <input required type="text" value={newSupplier.phone} onChange={e => setNewSupplier({...newSupplier, phone: e.target.value})} className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-slate-50 focus:bg-white text-sm" dir="ltr" placeholder="05X-XXXXXXX" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">דוא״ל</label>
                  <input required type="email" value={newSupplier.email} onChange={e => setNewSupplier({...newSupplier, email: e.target.value})} className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-slate-50 focus:bg-white text-sm" dir="ltr" />
                </div>
                <div className="pt-2">
                  <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-medium transition-colors">שמור ספק</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Supplier Stock Modal */}
      {selectedSupplierForStock && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full overflow-hidden animate-in zoom-in-95 duration-200" dir="rtl">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="font-bold text-lg text-slate-800">מלאי אצל: {selectedSupplierForStock.name}</h3>
                <p className="text-sm text-slate-500">{selectedSupplierForStock.type}</p>
              </div>
              <button onClick={() => setSelectedSupplierForStock(null)} className="text-slate-400 hover:text-slate-600 bg-white p-2 rounded-md shadow-sm border border-slate-200 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {getSupplierStock(selectedSupplierForStock.name).length > 0 ? (
                <div className="border border-slate-100 rounded-xl overflow-hidden">
                  <table className="w-full text-right">
                    <thead className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4 font-medium">שם הספר</th>
                        <th className="py-3 px-4 font-medium">מחבר</th>
                        <th className="py-3 px-4 font-medium text-center">כמות במלאי</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {getSupplierStock(selectedSupplierForStock.name).map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="py-3 px-4 font-medium text-slate-700">{item.title}</td>
                          <td className="py-3 px-4 text-slate-600 text-sm">{item.author}</td>
                          <td className="py-3 px-4 font-bold text-indigo-600 text-center">{item.amount.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-10">
                  <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500 font-medium">אין כרגע מלאי המשויך לספק זה.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Manual Stock Update Modal */}
      {isUpdateStockModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200" dir="rtl">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-lg text-slate-800">עדכון מלאי ידני</h3>
              <button onClick={() => setIsUpdateStockModalOpen(false)} className="text-slate-400 hover:text-slate-600 bg-white p-1.5 rounded-md shadow-sm border border-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <form onSubmit={handleManualStockUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">בחר ספר</label>
                  <select 
                    required 
                    value={stockUpdateForm.bookId} 
                    onChange={e => setStockUpdateForm({...stockUpdateForm, bookId: e.target.value})}
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                  >
                    <option value="" disabled>-- בחר מספרייה --</option>
                    {inventoryList.map(book => (
                      <option key={book.id} value={book.id}>{book.title} (נוכחי: {book.stock})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">כמות לעדכון (ניתן להזין מינוס)</label>
                  <input 
                    required 
                    type="number" 
                    value={stockUpdateForm.amount} 
                    onChange={e => setStockUpdateForm({...stockUpdateForm, amount: e.target.value})}
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                    placeholder="למשל: 50 או -20"
                    dir="ltr"
                  />
                  <p className="text-xs text-slate-400 mt-1">הזן מספר חיובי להוספה למלאי, או מספר שלילי להחסרה.</p>
                </div>
                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-medium mt-4">
                  עדכן מלאי
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Add New Book Modal */}
      {isAddBookModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]" dir="rtl">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
              <h3 className="font-bold text-lg text-slate-800">הוספת ספר חדש למלאי</h3>
              <button onClick={() => setIsAddBookModalOpen(false)} className="text-slate-400 hover:text-slate-600 bg-white p-1.5 rounded-md shadow-sm border border-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <form onSubmit={handleAddBook} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">שם הספר</label>
                    <input required type="text" value={newBookForm.title} onChange={e => setNewBookForm({...newBookForm, title: e.target.value})} className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-slate-50" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">מחבר</label>
                    <input required type="text" value={newBookForm.author} onChange={e => setNewBookForm({...newBookForm, author: e.target.value})} className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-slate-50" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">דאנאק (ISBN)</label>
                    <input type="text" value={newBookForm.isbn} onChange={e => setNewBookForm({...newBookForm, isbn: e.target.value})} className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-slate-50" dir="ltr" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">סה"כ במלאי</label>
                    <input required type="number" min="0" value={newBookForm.stock} onChange={e => setNewBookForm({...newBookForm, stock: Number(e.target.value)})} className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-slate-50" dir="ltr" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">רף התראה (מלאי נמוך)</label>
                    <input required type="number" min="0" value={newBookForm.threshold} onChange={e => setNewBookForm({...newBookForm, threshold: Number(e.target.value)})} className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-slate-50" dir="ltr" />
                  </div>
                </div>
                
                <div className="pt-4 mt-2 border-t border-slate-100">
                  <h4 className="text-sm font-bold text-slate-800 mb-3">מחירונים (₪)</h4>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">מחיר כללי</label>
                      <input required type="number" min="0" value={newBookForm.prices.general} onChange={e => setNewBookForm({...newBookForm, prices: {...newBookForm.prices, general: Number(e.target.value)}})} className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500" dir="ltr" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">מחיר ספק</label>
                      <input required type="number" min="0" value={newBookForm.prices.supplier} onChange={e => setNewBookForm({...newBookForm, prices: {...newBookForm.prices, supplier: Number(e.target.value)}})} className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500" dir="ltr" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">מחיר ישיבות</label>
                      <input required type="number" min="0" value={newBookForm.prices.yeshiva} onChange={e => setNewBookForm({...newBookForm, prices: {...newBookForm.prices, yeshiva: Number(e.target.value)}})} className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500" dir="ltr" />
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-2 border-t border-slate-100">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-sm font-bold text-slate-800">פיזור מלאי אצל ספקים (אופציונלי)</h4>
                    <button 
                      type="button" 
                      onClick={handleAddBookBreakdownRow}
                      className="text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-lg transition-colors font-medium flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> הוסף ספק לפיזור
                    </button>
                  </div>
                  
                  {newBookForm.breakdown.length === 0 ? (
                    <p className="text-xs text-slate-400">לא נבחרו ספקים. כל המלאי ייחשב ככללי.</p>
                  ) : (
                    <div className="space-y-2">
                      {newBookForm.breakdown.map((item, idx) => (
                        <div key={idx} className="flex gap-2 items-center">
                          <select 
                            required
                            value={item.supplier} 
                            onChange={(e) => handleUpdateBookBreakdownRow(idx, 'supplier', e.target.value)}
                            className="flex-1 p-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500"
                          >
                            <option value="" disabled>-- בחר ספק / מחסן --</option>
                            {suppliersList.map(sup => (
                              <option key={sup.id} value={sup.name}>{sup.name}</option>
                            ))}
                          </select>
                          <input 
                            required type="number" min="1" placeholder="כמות"
                            value={item.amount || ''}
                            onChange={(e) => handleUpdateBookBreakdownRow(idx, 'amount', e.target.value)}
                            className="w-24 p-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500" dir="ltr"
                          />
                          <button type="button" onClick={() => handleRemoveBookBreakdownRow(idx)} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-medium mt-6">
                  שמור ספר למלאי
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Existing Book Modal */}
      {isEditBookModalOpen && editingBook && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]" dir="rtl">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
              <h3 className="font-bold text-lg text-slate-800">עריכת ספר: {editingBook.title}</h3>
              <button onClick={() => {setIsEditBookModalOpen(false); setEditingBook(null);}} className="text-slate-400 hover:text-slate-600 bg-white p-1.5 rounded-md shadow-sm border border-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <form onSubmit={handleEditBookSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">שם הספר</label>
                    <input required type="text" value={editingBook.title} onChange={e => setEditingBook({...editingBook, title: e.target.value})} className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-slate-50" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">מחבר</label>
                    <input required type="text" value={editingBook.author} onChange={e => setEditingBook({...editingBook, author: e.target.value})} className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-slate-50" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">דאנאק (ISBN)</label>
                    <input type="text" value={editingBook.isbn} onChange={e => setEditingBook({...editingBook, isbn: e.target.value})} className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-slate-50" dir="ltr" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">סה"כ במלאי</label>
                    <input required type="number" min="0" value={editingBook.stock} onChange={e => setEditingBook({...editingBook, stock: Number(e.target.value)})} className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-slate-50" dir="ltr" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">רף התראה (מלאי נמוך)</label>
                    <input required type="number" min="0" value={editingBook.threshold} onChange={e => setEditingBook({...editingBook, threshold: Number(e.target.value)})} className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-slate-50" dir="ltr" />
                  </div>
                </div>
                
                <div className="pt-4 mt-2 border-t border-slate-100">
                  <h4 className="text-sm font-bold text-slate-800 mb-3">מחירונים (₪)</h4>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">מחיר כללי</label>
                      <input required type="number" min="0" value={editingBook.prices.general} onChange={e => setEditingBook({...editingBook, prices: {...editingBook.prices, general: Number(e.target.value)}})} className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500" dir="ltr" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">מחיר ספק</label>
                      <input required type="number" min="0" value={editingBook.prices.supplier} onChange={e => setEditingBook({...editingBook, prices: {...editingBook.prices, supplier: Number(e.target.value)}})} className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500" dir="ltr" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">מחיר ישיבות</label>
                      <input required type="number" min="0" value={editingBook.prices.yeshiva} onChange={e => setEditingBook({...editingBook, prices: {...editingBook.prices, yeshiva: Number(e.target.value)}})} className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500" dir="ltr" />
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-2 border-t border-slate-100">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-sm font-bold text-slate-800">פיזור מלאי אצל ספקים</h4>
                    <button 
                      type="button" 
                      onClick={handleEditBookBreakdownRow}
                      className="text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-lg transition-colors font-medium flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> הוסף ספק לפיזור
                    </button>
                  </div>
                  
                  {editingBook.breakdown.length === 0 ? (
                    <p className="text-xs text-slate-400">לא נבחרו ספקים. כל המלאי ייחשב ככללי.</p>
                  ) : (
                    <div className="space-y-2">
                      {editingBook.breakdown.map((item, idx) => (
                        <div key={idx} className="flex gap-2 items-center">
                          <select 
                            required
                            value={item.supplier} 
                            onChange={(e) => handleUpdateEditBookBreakdownRow(idx, 'supplier', e.target.value)}
                            className="flex-1 p-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500"
                          >
                            <option value="" disabled>-- בחר ספק / מחסן --</option>
                            {suppliersList.map(sup => (
                              <option key={sup.id} value={sup.name}>{sup.name}</option>
                            ))}
                          </select>
                          <input 
                            required type="number" min="1" placeholder="כמות"
                            value={item.amount || ''}
                            onChange={(e) => handleUpdateEditBookBreakdownRow(idx, 'amount', e.target.value)}
                            className="w-24 p-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500" dir="ltr"
                          />
                          <button type="button" onClick={() => handleRemoveEditBookBreakdownRow(idx)} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-medium mt-6">
                  שמור שינויים
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Task (Book Production) Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full h-[90vh] md:h-auto md:max-h-[85vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200" dir="rtl">
            <div className="p-4 md:p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50 shrink-0">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-1">{selectedTask.title}</h2>
                <p className="text-sm md:text-base text-slate-500">מאת: {selectedTask.author} | יעד לסיום: {selectedTask.date}</p>
              </div>
              <button onClick={() => setSelectedTask(null)} className="text-slate-400 hover:text-slate-600 bg-white p-2 rounded-md shadow-sm border border-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 md:space-y-8">
              
              {/* Files Section */}
              <section>
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Paperclip className="w-5 h-5 text-indigo-600" />
                  קבצי מקור
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                  
                  {/* Cover */}
                  <div className="border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center text-center gap-3 bg-slate-50/50">
                    <div className={`p-3 rounded-full ${selectedTask.coverFile ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                      <ImageIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-medium text-sm text-slate-700">עיצוב כריכה</p>
                      {selectedTask.coverFile ? 
                        <p className="text-xs text-emerald-600 mt-1 font-mono">{selectedTask.coverFile}</p> : 
                        <p className="text-xs text-slate-400 mt-1">לא הועלה</p>}
                    </div>
                    {userRole === 'admin' && (
                      <button onClick={() => handleFileUpload('coverFile')} className="mt-2 text-xs bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg flex items-center gap-1.5 hover:bg-slate-50 w-full justify-center">
                        <Upload className="w-3 h-3" /> {selectedTask.coverFile ? 'החלף קובץ' : 'העלה קובץ'}
                      </button>
                    )}
                  </div>

                  {/* Manuscript */}
                  <div className="border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center text-center gap-3 bg-slate-50/50">
                    <div className={`p-3 rounded-full ${selectedTask.bookFile ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-medium text-sm text-slate-700">קובץ הספר (פנים)</p>
                      {selectedTask.bookFile ? 
                        <p className="text-xs text-blue-600 mt-1 font-mono">{selectedTask.bookFile}</p> : 
                        <p className="text-xs text-slate-400 mt-1">לא הועלה</p>}
                    </div>
                    {userRole === 'admin' && (
                      <button onClick={() => handleFileUpload('bookFile')} className="mt-2 text-xs bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg flex items-center gap-1.5 hover:bg-slate-50 w-full justify-center">
                        <Upload className="w-3 h-3" /> {selectedTask.bookFile ? 'החלף קובץ' : 'העלה קובץ'}
                      </button>
                    )}
                  </div>

                  {/* Dedications */}
                  <div className="border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center text-center gap-3 bg-slate-50/50">
                    <div className={`p-3 rounded-full ${selectedTask.dedicationFile ? 'bg-purple-100 text-purple-600' : 'bg-slate-100 text-slate-400'}`}>
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-medium text-sm text-slate-700">רשימת הקדשות</p>
                      {selectedTask.dedicationFile ? 
                        <p className="text-xs text-purple-600 mt-1 font-mono">{selectedTask.dedicationFile}</p> : 
                        <p className="text-xs text-slate-400 mt-1">לא הועלה</p>}
                    </div>
                    {userRole === 'admin' && (
                      <button onClick={() => handleFileUpload('dedicationFile')} className="mt-2 text-xs bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg flex items-center gap-1.5 hover:bg-slate-50 w-full justify-center">
                        <Upload className="w-3 h-3" /> {selectedTask.dedicationFile ? 'החלף קובץ' : 'העלה קובץ'}
                      </button>
                    )}
                  </div>
                </div>
              </section>

              {/* Invoices Section */}
              <section>
                <div className="flex justify-between items-end mb-4">
                  <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <Receipt className="w-5 h-5 text-indigo-600" />
                    מעקב הוצאות וחשבוניות (תמחור)
                  </h3>
                  <div className="text-sm font-bold bg-indigo-50 text-indigo-700 px-3 py-1 rounded-lg">
                    סה"כ: ₪{selectedTask.invoices.reduce((s, i) => s + i.amount, 0).toLocaleString()}
                  </div>
                </div>
                
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden mb-4">
                  <table className="w-full text-right text-sm">
                    <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-4 font-medium">תיאור הוצאה</th>
                        <th className="py-2.5 px-4 font-medium">סכום</th>
                        <th className="py-2.5 px-4 font-medium text-center">אסמכתא</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedTask.invoices.map(inv => (
                        <tr key={inv.id}>
                          <td className="py-3 px-4 font-medium text-slate-700">{inv.desc}</td>
                          <td className="py-3 px-4 text-slate-600">₪{inv.amount.toLocaleString()}</td>
                          <td className="py-3 px-4 text-center">
                            {inv.receiptFile ? (
                              <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                                <CheckCircle className="w-3 h-3" /> הועלה
                              </span>
                            ) : (
                              userRole === 'admin' ? (
                                <button onClick={() => handleInvoiceReceiptUpload(inv.id)} className="text-xs text-indigo-600 hover:text-indigo-700 font-medium underline flex items-center justify-center gap-1 mx-auto">
                                  <Upload className="w-3 h-3" /> צרף קבלה
                                </button>
                              ) : (
                                <span className="text-xs text-slate-400">חסר</span>
                              )
                            )}
                          </td>
                        </tr>
                      ))}
                      {selectedTask.invoices.length === 0 && (
                        <tr>
                          <td colSpan="3" className="py-6 text-center text-slate-400">אין הוצאות רשומות לספר זה.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {userRole === 'admin' && (
                  <form onSubmit={handleAddInvoice} className="flex gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <input 
                      required type="text" placeholder="תיאור (למשל: עריכה לשונית)" 
                      value={newInvoice.desc} onChange={e => setNewInvoice({...newInvoice, desc: e.target.value})}
                      className="flex-1 p-2 text-sm border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" 
                    />
                    <input 
                      required type="number" placeholder="סכום (₪)" 
                      value={newInvoice.amount} onChange={e => setNewInvoice({...newInvoice, amount: e.target.value})}
                      className="w-28 p-2 text-sm border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" 
                    />
                    <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                      הוסף
                    </button>
                  </form>
                )}
              </section>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
