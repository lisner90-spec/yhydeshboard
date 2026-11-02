import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, KanbanSquare, Package, BookOpen, AlertTriangle, CheckCircle, 
  TrendingUp, FileText, PenTool, Printer, Truck, Store, Users, Search, X, 
  Image as ImageIcon, Upload, Receipt, Plus, DollarSign, Paperclip, Mail, 
  Megaphone, Settings, RefreshCw, Share2, Download, Edit, Phone, Menu, Trash2, 
  Settings2, UserPlus, Send, UserCog, Info
} from 'lucide-react';

// ==========================================
// 1. הגדרות מסד נתונים - Firebase
// ==========================================
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, onSnapshot, doc, setDoc, addDoc, updateDoc, deleteDoc, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBACO6rv7KvdmWyPBPp1RzaeVUyQorQpVI",
  authDomain: "yhydeshboard.firebaseapp.com",
  projectId: "yhydeshboard",
  storageBucket: "yhydeshboard.firebasestorage.app",
  messagingSenderId: "498271801335",
  appId: "1:498271801335:web:1609f07e024ac66709e8f2",
  measurementId: "G-GHK9P9E47J"
};

const app = Object.keys(firebaseConfig).length > 0 ? initializeApp(firebaseConfig) : null;
const auth = app ? getAuth(app) : null;
let db = app ? getFirestore(app) : null;
const appId = 'publisher_erp_v1'; 
const getCollRef = (collName) => collection(db, 'erp', appId, collName);
const getDocRef = (collName, docId) => doc(db, 'erp', appId, collName, docId);

// ==========================================
// 2. הגדרות שליחת מיילים - EmailJS
// ==========================================
const EMAILJS_SERVICE_ID = "service_65ojtol";
const EMAILJS_TEMPLATE_ID = "template_ye1ep37";
const EMAILJS_PUBLIC_KEY = "7Xb1V_hTF9rs61RxX";

// ==========================================
// 3. נתוני הדגמה 
// ==========================================
const initialStatsData = {
  monthly: { inProduction: '12', completed: '145', sold: '3,240', revenue: '142,500', trend: '+18.5%', alerts: '3' },
  yearly: { inProduction: '12', completed: '34', sold: '38,500', revenue: '1,750,000', trend: '+42.3%', alerts: '3' }
};

const kanbanColumns = [
  { id: 'in_progress', title: 'ספרים בעבודה', icon: PenTool, color: 'border-blue-200 bg-blue-50' },
  { id: 'published', title: 'ספרים שיצאו', icon: BookOpen, color: 'border-emerald-200 bg-emerald-50' }
];

const initialTasksFlat = [
  { status: 'in_progress', title: 'מסע אל הלא נודע', author: 'יעל כהן', date: '15/10/2026', coverFile: null, bookFile: 'טיוטה_ראשונית.docx', dedicationFile: null, invoices: [{ id: 1, desc: 'קריאת לקטורה', amount: 450, receiptFile: null }] },
  { status: 'in_progress', title: 'סודות המטבח האיטלקי', author: 'מיכל אהרוני', date: '01/11/2026', coverFile: null, bookFile: 'מטבח_איטלקי_עריכה.pdf', dedicationFile: null, invoices: [{ id: 2, desc: 'מקדמה לעורכת', amount: 1500, receiptFile: 'קבלה_עורכת.pdf' }] },
  { status: 'in_progress', title: 'כלכלת המחר', author: 'פרופ׳ יצחק לוי', date: '10/11/2026', coverFile: 'cover_draft_v2.jpg', bookFile: 'כלכלת_המחר_סופי.pdf', dedicationFile: null, invoices: [{ id: 3, desc: 'עריכה לשונית', amount: 2200, receiptFile: null }, { id: 4, desc: 'עיצוב כריכה', amount: 1800, receiptFile: null }] },
  { status: 'published', title: 'המדריך השלם לבינה מלאכותית', author: 'עמית שרון', date: '15/11/2026', coverFile: 'ai_cover_final.pdf', bookFile: 'ai_book_print.pdf', dedicationFile: 'ai_dedications.pdf', invoices: [{ id: 5, desc: 'עריכה ועימוד', amount: 5500, receiptFile: 'חשבונית_עימוד.pdf' }] }
];

const initialSuppliers = [
  { name: 'מחסן ראשי - פתח תקווה', type: 'מחסן לוגיסטי', contact: 'אבי כהן', phone: '050-1234567', email: 'avi@publisher-logistics.co.il', status: 'פעיל - יש הסכם' },
  { name: 'צומת ספרים - מרלו״ג', type: 'רשת קמעונאית', contact: 'רונית לוי', phone: '052-7654321', email: 'ronit@zomet.co.il', status: 'פעיל - יש הסכם' },
  { name: 'סטימצקי - הפצה', type: 'רשת קמעונאית', contact: 'דני אלמגור', phone: '054-9876543', email: 'dani@steimatzky.co.il', status: 'ממתין לספרים' },
  { name: 'דפוס קורן בע"מ', type: 'בית דפוס', contact: 'שמואל קורן', phone: '02-6543210', email: 'office@koren-print.co.il', status: 'פעיל - יש הסכם' }
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

const initialCampaigns = [
  { name: 'קמפיין חגים - פייסבוק ואינסטגרם', book: 'סודות המטבח האיטלקי', budget: 4500, spent: 2100, roas: '2.4x' },
  { name: 'קידום ממומן גוגל (Search)', book: 'המדריך השלם לבינה מלאכותית', budget: 2000, spent: 1850, roas: '3.1x' }
];

const initialPrCopies = [
  { recipient: 'עמית סגל (חדשות 12)', book: 'כלכלת המחר', date: '10/11/2026', status: 'נמסר ליעד' },
  { recipient: 'מוסף ספרים - הארץ', book: 'מסע אל הלא נודע', date: '01/11/2026', status: 'פורסמה ביקורת' }
];

const initialIntegrations = [
  { id: 'morning', name: 'Morning (חשבונית ירוקה)', type: 'הנהלת חשבונות ומסמכים', connected: true, lastSync: 'לפני 15 דקות', logo: 'M' },
  { id: 'shopify', name: 'Shopify (אתר ההוצאה)', type: 'פלטפורמת מסחר / חנות אונליין', connected: true, lastSync: 'לפני שעתיים', logo: 'S' }
];

const initialInventory = [
  { 
    title: 'המדריך השלם לבינה מלאכותית', author: 'עמית שרון', isbn: '978-965-123-456-7', threshold: 200, 
    editions: [{ name: 'מהדורה 1', printRun: 2000 }], publisherStock: 250,
    prices: { general: 110, supplier: 55, yeshiva: 70 },
    breakdown: [
      { supplier: 'מחסן ראשי - פתח תקווה', amount: 800 },
      { supplier: 'צומת ספרים - מרלו״ג', amount: 250 },
      { supplier: 'סטימצקי - הפצה', amount: 200 }
    ]
  },
  { 
    title: 'סודות המטבח האיטלקי', author: 'מיכל אהרוני', isbn: '978-965-456-789-0', threshold: 150, 
    editions: [{ name: 'מהדורה 1', printRun: 1500 }, { name: 'מהדורה 2', printRun: 1000 }], publisherStock: 100,
    prices: { general: 120, supplier: 60, yeshiva: 80 },
    breakdown: [
      { supplier: 'מחסן ראשי - פתח תקווה', amount: 400 },
      { supplier: 'צומת ספרים - מרלו״ג', amount: 300 },
      { supplier: 'סטימצקי - הפצה', amount: 150 }
    ]
  }
];

const initialValidUsers = [
  { username: 'admin', password: 'admin2026', role: 'admin', name: 'מנהל ראשי' },
  { username: 'view', password: 'view2026', role: 'viewer', name: 'צופה' }
];

export default function PublisherApp() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userRole, setUserRole] = useState(null); 
  const [currentUserName, setCurrentUserName] = useState(''); 
  const [dashboardPeriod, setDashboardPeriod] = useState('monthly'); 
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // --- UI System States (Toasts & Confirms) ---
  const [toastMessage, setToastMessage] = useState({ text: '', type: '' });
  const [confirmDialog, setConfirmDialog] = useState(null);

  const showToast = (text, type = 'info') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage({ text: '', type: '' }), 3500);
  };

  // --- Firebase & Database States ---
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [isDbReady, setIsDbReady] = useState(false);

  // --- Auth & Users States ---
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [usersList, setUsersList] = useState(initialValidUsers);
  const [isUserManageModalOpen, setIsUserManageModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', username: '', password: '', role: 'viewer', email: '' });

  // --- Dashboard Editing States ---
  const [statsData, setStatsData] = useState(initialStatsData);
  const [isEditStatsModalOpen, setIsEditStatsModalOpen] = useState(false);
  const [editingStats, setEditingStats] = useState(null);

  // --- Suppliers States ---
  const [suppliersList, setSuppliersList] = useState(initialSuppliers.map((s, i) => ({ id: i.toString(), ...s })));
  const [isAddSupplierModalOpen, setIsAddSupplierModalOpen] = useState(false);
  const [newSupplier, setNewSupplier] = useState({ name: '', type: 'רשת קמעונאית', contact: '', phone: '', email: '', status: 'פעיל - יש הסכם' });
  const [isEditSupplierModalOpen, setIsEditSupplierModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [selectedSupplierForStock, setSelectedSupplierForStock] = useState(null);

  // --- Supplier Invoices / Orders State ---
  const [isSupplierInvoiceModalOpen, setIsSupplierInvoiceModalOpen] = useState(false);
  const [invoiceSupplier, setInvoiceSupplier] = useState(null);
  const [invoiceItems, setInvoiceItems] = useState([]);

  // --- Marketing & PR States ---
  const [campaignsList, setCampaignsList] = useState(initialCampaigns.map((c, i) => ({ id: i.toString(), ...c })));
  const [isEditCampaignModalOpen, setIsEditCampaignModalOpen] = useState(false);
  const [isAddCampaignModalOpen, setIsAddCampaignModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [newCampaign, setNewCampaign] = useState({ name: '', book: '', budget: '', spent: '', roas: '' });

  const [prCopies, setPrCopies] = useState(initialPrCopies.map((p, i) => ({ id: i.toString(), ...p })));
  const [isEditPrModalOpen, setIsEditPrModalOpen] = useState(false);
  const [isAddPrModalOpen, setIsAddPrModalOpen] = useState(false);
  const [editingPr, setEditingPr] = useState(null);
  const [newPr, setNewPr] = useState({ recipient: '', book: '', date: '', status: 'במשלוח' });

  // --- Inventory States ---
  const [searchQuery, setSearchQuery] = useState('');
  const [inventoryList, setInventoryList] = useState(initialInventory.map((b, i) => ({ id: i.toString(), ...b })));
  
  const [isUpdateStockModalOpen, setIsUpdateStockModalOpen] = useState(false);
  const [stockUpdateForm, setStockUpdateForm] = useState({ bookId: '', amount: 0 });

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
  const [tasksList, setTasksList] = useState(initialTasksFlat.map((t, i) => ({ id: i.toString(), ...t })));
  const [selectedTask, setSelectedTask] = useState(null);
  const [newInvoice, setNewInvoice] = useState({ desc: '', amount: '' });

  const tasks = {
    in_progress: tasksList.filter(t => t.status === 'in_progress'),
    published: tasksList.filter(t => t.status === 'published')
  };

  const [integrations, setIntegrations] = useState(initialIntegrations);
  const [isSyncing, setIsSyncing] = useState(null);

  // --- Background Email Sender ---
  const sendEmailBackground = async (toEmail, subject, body) => {
    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
      showToast("שגיאה: חסרים מפתחות EmailJS. לא ניתן לשלוח מייל.", "error");
      return;
    }

    try {
      const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_id: EMAILJS_SERVICE_ID,
          template_id: EMAILJS_TEMPLATE_ID,
          user_id: EMAILJS_PUBLIC_KEY,
          template_params: { to_email: toEmail, subject: subject, message: body }
        })
      });

      if (response.ok) {
        showToast("האימייל נשלח בהצלחה ליעדו!", "success");
      } else {
        const errorText = await response.text();
        throw new Error(errorText);
      }
    } catch (error) {
      console.error("Error sending email:", error);
      showToast("שגיאה בשליחת המייל. נסה שנית.", "error");
    }
  };

  // --- FIREBASE EFFECTS ---
  useEffect(() => {
    if (!auth) {
      setIsDbReady(true);
      return;
    }
    const initAuth = async () => {
      try {
        await signInAnonymously(auth);
      } catch (error) {
        console.warn("Auth error (Cloud disconnected):", error.message);
        db = null; // מנתק את הענן במקרה של שגיאת הרשאות ועובר לעבודה מקומית
        setIsDbReady(true);
      }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setFirebaseUser(u);
      if (u) setIsDbReady(true);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!db || !isDbReady || !firebaseUser) return;
    const unsubs = [];
    const seedDatabase = async () => {
      try {
        const snap = await getDocs(getCollRef('inventory'));
        if (snap.empty) {
          console.log("Seeding initial mock data to Database...");
          await setDoc(getDocRef('globals', 'stats'), initialStatsData);
          for (const item of initialInventory) await addDoc(getCollRef('inventory'), item);
          for (const item of initialSuppliers) await addDoc(getCollRef('suppliers'), item);
          for (const item of initialCampaigns) await addDoc(getCollRef('campaigns'), item);
          for (const item of initialPrCopies) await addDoc(getCollRef('prCopies'), item);
          for (const item of initialTasksFlat) await addDoc(getCollRef('tasks'), item);
        }
        return true;
      } catch (e) {
        console.warn("Firebase fallback. Local state mode.", e);
        return false;
      }
    };

    seedDatabase().then((success) => {
      if (!success) {
        db = null; 
        return;
      }
      const handleDbError = (err) => {
        console.warn("Firebase sync error, disabling cloud sync.", err);
        db = null;
      };
      try {
        unsubs.push(onSnapshot(getCollRef('inventory'), snap => setInventoryList(snap.docs.map(d => ({id: d.id, ...d.data()}))), handleDbError));
        unsubs.push(onSnapshot(getCollRef('suppliers'), snap => setSuppliersList(snap.docs.map(d => ({id: d.id, ...d.data()}))), handleDbError));
        unsubs.push(onSnapshot(getCollRef('campaigns'), snap => setCampaignsList(snap.docs.map(d => ({id: d.id, ...d.data()}))), handleDbError));
        unsubs.push(onSnapshot(getCollRef('prCopies'), snap => setPrCopies(snap.docs.map(d => ({id: d.id, ...d.data()}))), handleDbError));
        unsubs.push(onSnapshot(getCollRef('tasks'), snap => setTasksList(snap.docs.map(d => ({id: d.id, ...d.data()}))), handleDbError));
        unsubs.push(onSnapshot(getDocRef('globals', 'stats'), snap => {
          if (snap.exists()) setStatsData(snap.data());
        }, handleDbError));
      } catch (e) {
        handleDbError(e);
      }
    });

    return () => unsubs.forEach(unsub => unsub());
  }, [isDbReady, firebaseUser]);


  // --- Handlers ---
  const handleLogin = (e) => {
    e.preventDefault();
    const user = usersList.find(u => u.username === username && u.password === password);
    
    if (user) {
      setUserRole(user.role);
      setCurrentUserName(user.name);
      setLoginError('');
    } else {
      setLoginError('שם משתמש או סיסמה שגויים. נסה שוב.');
    }
  };

  // User Management
  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!newUser.username || !newUser.password || !newUser.name) return;
    
    setUsersList([...usersList, { 
      username: newUser.username, password: newUser.password, role: newUser.role, name: newUser.name 
    }]);

    if (newUser.email) {
      const subject = "פרטי התחברות למערכת ניהול הוצאה לאור";
      const appUrl = window.location.origin; // השגת הקישור האוטומטי לאפליקציה
      const body = `שלום ${newUser.name},\n\nנוצר עבורך משתמש חדש למערכת הניהול.\n\nשם משתמש: ${newUser.username}\nסיסמה: ${newUser.password}\n\nקישור כניסה למערכת:\n${appUrl}\n\nבברכה,\nצוות המערכת`;
      
      showToast("מקים משתמש ושולח מייל ברקע...", "info");
      sendEmailBackground(newUser.email, subject, body);
    } else {
      showToast("משתמש נוצר בהצלחה במערכת", "success");
    }

    setNewUser({ name: '', username: '', password: '', role: 'viewer', email: '' });
    setIsUserManageModalOpen(false);
  };

  const handleRemoveUser = (usernameToRemove) => {
    if(usernameToRemove === 'admin') {
      showToast("לא ניתן למחוק את משתמש המנהל הראשי.", "error");
      return;
    }
    setConfirmDialog({
      message: `האם אתה בטוח שברצונך למחוק את המשתמש ${usernameToRemove}?`,
      onConfirm: async () => {
        const userToDelete = usersList.find(u => u.username === usernameToRemove);
        if (db && userToDelete && userToDelete.id) {
          await deleteDoc(getDocRef('users', userToDelete.id));
        } else {
          setUsersList(usersList.filter(u => u.username !== usernameToRemove));
        }
        showToast("המשתמש הוסר מהמערכת", "info");
      }
    });
  };

  // Stock Calc
  const calculateTotalStock = (book) => {
    const suppliersTotal = (book.breakdown || []).reduce((sum, item) => sum + Number(item.amount || 0), 0);
    return Number(book.publisherStock || 0) + suppliersTotal;
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

  // Dashboard Edit
  const openEditStats = () => {
    setEditingStats({ ...statsData[dashboardPeriod] });
    setIsEditStatsModalOpen(true);
  };

  const handleEditStatsSubmit = async (e) => {
    e.preventDefault();
    const newData = { ...statsData, [dashboardPeriod]: editingStats };
    if (db) await setDoc(getDocRef('globals', 'stats'), newData);
    else setStatsData(newData);
    setIsEditStatsModalOpen(false);
    showToast("נתוני הדאשבורד עודכנו בהצלחה", "success");
  };

  // Suppliers
  const handleAddSupplier = async (e) => {
    e.preventDefault();
    if (db) await addDoc(getCollRef('suppliers'), newSupplier);
    else setSuppliersList([...suppliersList, { ...newSupplier, id: Date.now().toString() }]);
    setIsAddSupplierModalOpen(false);
    setNewSupplier({ name: '', type: 'רשת קמעונאית', contact: '', phone: '', email: '', status: 'פעיל - יש הסכם' });
    showToast("ספק חדש נוסף למערכת", "success");
  };

  const handleEditSupplierSubmit = async (e) => {
    e.preventDefault();
    if (db) await updateDoc(getDocRef('suppliers', editingSupplier.id), editingSupplier);
    else setSuppliersList(suppliersList.map(s => s.id === editingSupplier.id ? editingSupplier : s));
    setIsEditSupplierModalOpen(false);
    showToast("פרטי הספק עודכנו", "success");
  };

  // Invoices & Emails
  const openSupplierInvoice = (supplier) => {
    setInvoiceSupplier(supplier);
    setInvoiceItems([{ bookId: '', amount: 1, price: 0 }]);
    setIsSupplierInvoiceModalOpen(true);
  };

  const handleInvoiceItemChange = (index, field, value) => {
    const newItems = [...invoiceItems];
    if (field === 'bookId') {
      newItems[index].bookId = value;
      const book = inventoryList.find(b => b.id === value);
      if (book) newItems[index].price = book?.prices?.supplier || 0;
    } else {
      newItems[index][field] = Number(value);
    }
    setInvoiceItems(newItems);
  };

  const addInvoiceItemRow = () => setInvoiceItems([...invoiceItems, { bookId: '', amount: 1, price: 0 }]);
  const removeInvoiceItemRow = (index) => setInvoiceItems(invoiceItems.filter((_, i) => i !== index));

  const sendInvoiceEmail = () => {
    if (!invoiceSupplier || !invoiceSupplier.email) {
      showToast("לספק זה לא מוגדרת כתובת דוא״ל במערכת.", "error");
      return;
    }
    let totalOrderPrice = 0;
    let itemsText = invoiceItems.map(item => {
      const book = inventoryList.find(b => b.id === item.bookId);
      if (!book) return '';
      const lineTotal = item.amount * item.price;
      totalOrderPrice += lineTotal;
      return `- ${book.title} | כמות: ${item.amount} | מחיר יחידה: ₪${item.price} | סה"כ שורה: ₪${lineTotal}`;
    }).join('\n');

    const subject = `הזמנה / סיכום פרטי הפצה - ${invoiceSupplier.name}`;
    const body = `שלום ${invoiceSupplier.contact},\n\nלהלן סיכום הזמנת ספרים / תעודת משלוח מול ההוצאה לאור:\n\n${itemsText}\n\n--------------------------------\nסה"כ לתשלום / חיוב: ₪${totalOrderPrice.toLocaleString()}\n--------------------------------\n\nנא לאשר קבלת המייל וההזמנה.\n\nבברכה,\nהוצאה לאור.`;
    
    showToast("שולח מייל לספק ברקע...", "info");
    sendEmailBackground(invoiceSupplier.email, subject, body);
    setIsSupplierInvoiceModalOpen(false);
  };

  // Campaigns & PR
  const handleAddCampaignSubmit = async (e) => {
    e.preventDefault();
    if (db) await addDoc(getCollRef('campaigns'), newCampaign);
    else setCampaignsList([...campaignsList, { ...newCampaign, id: Date.now().toString() }]);
    setIsAddCampaignModalOpen(false);
    setNewCampaign({ name: '', book: '', budget: '', spent: '', roas: '' });
    showToast("קמפיין שיווק חדש נוצר", "success");
  };

  const handleEditCampaignSubmit = async (e) => {
    e.preventDefault();
    if (db) await updateDoc(getDocRef('campaigns', editingCampaign.id), editingCampaign);
    else setCampaignsList(campaignsList.map(camp => camp.id === editingCampaign.id ? editingCampaign : camp));
    setIsEditCampaignModalOpen(false);
    showToast("נתוני הקמפיין עודכנו", "success");
  };

  const handleAddPrSubmit = async (e) => {
    e.preventDefault();
    if (db) await addDoc(getCollRef('prCopies'), newPr);
    else setPrCopies([...prCopies, { ...newPr, id: Date.now().toString() }]);
    setIsAddPrModalOpen(false);
    setNewPr({ recipient: '', book: '', date: '', status: 'במשלוח' });
    showToast("פריט יח״צ נוסף", "success");
  };

  const handleEditPrSubmit = async (e) => {
    e.preventDefault();
    if (db) await updateDoc(getDocRef('prCopies', editingPr.id), editingPr);
    else setPrCopies(prCopies.map(pr => pr.id === editingPr.id ? editingPr : pr));
    setIsEditPrModalOpen(false);
    showToast("סטטוס יח״צ עודכן", "success");
  };

  // Books
  const handleAddEdition = (formSetter, formState) => {
    formSetter({ ...formState, editions: [...formState.editions, { name: `מהדורה ${formState.editions.length + 1}`, printRun: 0 }] });
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

  const handleAddBook = async (e) => {
    e.preventDefault();
    if (db) await addDoc(getCollRef('inventory'), newBookForm);
    else setInventoryList([...inventoryList, { ...newBookForm, id: Date.now().toString() }]);
    setIsAddBookModalOpen(false);
    setNewBookForm(initialBookFormState);
    showToast("ספר חדש התווסף בהצלחה למלאי", "success");
  };

  const handleAddBookBreakdownRow = () => setNewBookForm({ ...newBookForm, breakdown: [...newBookForm.breakdown, { supplier: '', amount: 0 }] });
  const handleUpdateBookBreakdownRow = (index, field, value) => {
    const updatedBreakdown = [...newBookForm.breakdown];
    updatedBreakdown[index][field] = field === 'amount' ? Number(value) : value;
    setNewBookForm({ ...newBookForm, breakdown: updatedBreakdown });
  };
  const handleRemoveBookBreakdownRow = (index) => setNewBookForm({ ...newBookForm, breakdown: newBookForm.breakdown.filter((_, i) => i !== index) });

  const openEditBook = (book) => {
    setEditingBook(JSON.parse(JSON.stringify(book))); 
    setIsEditBookModalOpen(true);
  };

  const handleEditBookSubmit = async (e) => {
    e.preventDefault();
    if (db) await updateDoc(getDocRef('inventory', editingBook.id), editingBook);
    else setInventoryList(inventoryList.map(b => b.id === editingBook.id ? editingBook : b));
    setIsEditBookModalOpen(false);
    setEditingBook(null);
    showToast("פרטי הספר ומלאי המהדורות עודכנו", "success");
  };

  const handleEditBookBreakdownRow = () => setEditingBook({ ...editingBook, breakdown: [...editingBook.breakdown, { supplier: '', amount: 0 }] });
  const handleUpdateEditBookBreakdownRow = (index, field, value) => {
    const updatedBreakdown = [...editingBook.breakdown];
    updatedBreakdown[index][field] = field === 'amount' ? Number(value) : value;
    setEditingBook({ ...editingBook, breakdown: updatedBreakdown });
  };
  const handleRemoveEditBookBreakdownRow = (index) => setEditingBook({ ...editingBook, breakdown: editingBook.breakdown.filter((_, i) => i !== index) });

  const handleDeleteBook = async (id) => {
    setConfirmDialog({
      message: "האם אתה בטוח שברצונך למחוק ספר זה מהמלאי לצמיתות?",
      onConfirm: async () => {
        if (db) await deleteDoc(getDocRef('inventory', id));
        else setInventoryList(inventoryList.filter(book => book.id !== id));
        showToast("הספר נמחק מהמלאי", "info");
      }
    });
  };

  const handleManualStockUpdate = async (e) => {
    e.preventDefault();
    const amount = Number(stockUpdateForm.amount);
    if (!stockUpdateForm.bookId || isNaN(amount)) return;
    
    if (db) {
      const book = inventoryList.find(b => b.id === stockUpdateForm.bookId);
      if (book) await updateDoc(getDocRef('inventory', book.id), { publisherStock: Math.max(0, Number(book.publisherStock) + amount) });
    } else {
      setInventoryList(inventoryList.map(book => 
        book.id === stockUpdateForm.bookId ? { ...book, publisherStock: Math.max(0, Number(book.publisherStock) + amount) } : book
      ));
    }
    
    setIsUpdateStockModalOpen(false);
    setStockUpdateForm({ bookId: '', amount: 0 });
    showToast("הוספת מלאי ידנית הושלמה", "success");
  };

  const handleToggleIntegration = (id) => {
    if (userRole !== 'admin') return;
    setIntegrations(integrations.map(int => 
      int.id === id ? { ...int, connected: !int.connected, lastSync: !int.connected ? 'כרגע' : int.lastSync } : int
    ));
    showToast("סטטוס חיבור לאינטגרציה עודכן", "success");
  };

  const handleSync = (id) => {
    if (userRole !== 'admin') return;
    setIsSyncing(id);
    setTimeout(() => {
      setIntegrations(integrations.map(int => 
        int.id === id ? { ...int, lastSync: 'לפני מספר שניות' } : int
      ));
      setIsSyncing(null);
      showToast("סנכרון נתונים למערכת חיצונית הושלם", "success");
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

  const handleAddInvoice = async (e) => {
    e.preventDefault();
    if (!newInvoice.desc || !newInvoice.amount) return;
    const updatedInvoices = [...(selectedTask.invoices || []), { id: Date.now(), desc: newInvoice.desc, amount: Number(newInvoice.amount), receiptFile: null }];
    if (db) await updateDoc(getDocRef('tasks', selectedTask.id), { invoices: updatedInvoices });
    else setTasksList(tasksList.map(t => t.id === selectedTask.id ? { ...t, invoices: updatedInvoices } : t));
    setSelectedTask({ ...selectedTask, invoices: updatedInvoices });
    setNewInvoice({ desc: '', amount: '' });
    showToast("שורת תמחור/הוצאה נוספה לפרויקט", "success");
  };

  const handleInvoiceReceiptUpload = async (invoiceId) => {
    const updatedInvoices = selectedTask.invoices.map(inv => inv.id === invoiceId ? { ...inv, receiptFile: 'אסמכתא_הועלתה.pdf' } : inv);
    if (db) await updateDoc(getDocRef('tasks', selectedTask.id), { invoices: updatedInvoices });
    else setTasksList(tasksList.map(t => t.id === selectedTask.id ? { ...t, invoices: updatedInvoices } : t));
    setSelectedTask({ ...selectedTask, invoices: updatedInvoices });
    showToast("אסמכתת תשלום הועלתה בהצלחה", "success");
  };

  const handleFileUpload = async (type) => {
    let fileName = type === 'coverFile' ? 'new_cover_uploaded.jpg' : type === 'bookFile' ? 'book_manuscript_v2.pdf' : 'dedications_list.docx';
    if (db) await updateDoc(getDocRef('tasks', selectedTask.id), { [type]: fileName });
    else setTasksList(tasksList.map(t => t.id === selectedTask.id ? { ...t, [type]: fileName } : t));
    setSelectedTask({ ...selectedTask, [type]: fileName });
    showToast("קובץ מקור התעדכן", "success");
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
      <div dir="rtl" className="flex h-screen w-full items-center justify-center bg-slate-50 font-sans p-4 relative">
        {toastMessage.text && (
          <div className={`absolute top-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-lg shadow-lg font-medium text-sm animate-in slide-in-from-top-4 fade-in duration-300 ${toastMessage.type === 'error' ? 'bg-red-500 text-white' : toastMessage.type === 'warning' ? 'bg-amber-500 text-white' : 'bg-emerald-600 text-white'}`}>
            {toastMessage.text}
          </div>
        )}
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

  const currentStats = statsData[dashboardPeriod] || initialStatsData.monthly;
  const dashboardStatsArray = [
    { id: 1, title: 'ספרים בהפקה', value: currentStats.inProduction, icon: PenTool, color: 'text-blue-600', bgColor: 'bg-blue-100' },
    { id: 2, title: dashboardPeriod === 'monthly' ? 'ספרים שהושלמו' : 'ספרים שהושלמו (השנה)', value: currentStats.completed, icon: BookOpen, color: 'text-indigo-600', bgColor: 'bg-indigo-100' },
    { id: 3, title: dashboardPeriod === 'monthly' ? 'נמכרו החודש (עותקים)' : 'נמכרו השנה (עותקים)', value: currentStats.sold, icon: Package, color: 'text-emerald-600', bgColor: 'bg-emerald-100' },
    { id: 4, title: dashboardPeriod === 'monthly' ? 'רווח מכירות חודשי (₪)' : 'רווח מכירות שנתי (₪)', value: `₪${currentStats.revenue}`, icon: DollarSign, color: 'text-green-600', bgColor: 'bg-green-100' },
    { id: 5, title: dashboardPeriod === 'monthly' ? 'מגמת מכירות (חודשי)' : 'גידול שנתי במכירות', value: currentStats.trend, icon: TrendingUp, color: 'text-purple-600', bgColor: 'bg-purple-100' },
    { id: 6, title: 'התראות מלאי נמוך', value: currentStats.alerts, icon: AlertTriangle, color: 'text-amber-600', bgColor: 'bg-amber-100' }
  ];

  return (
    <div dir="rtl" className="flex h-screen w-full bg-slate-50 text-slate-800 font-sans overflow-hidden relative">
      
      {/* --- Global Toast Notifications --- */}
      {toastMessage.text && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-[100] px-4 py-2.5 rounded-lg shadow-lg font-medium text-sm flex items-center gap-2 animate-in slide-in-from-top-4 fade-in duration-300 ${toastMessage.type === 'error' ? 'bg-red-500 text-white' : toastMessage.type === 'warning' ? 'bg-amber-500 text-white' : 'bg-emerald-600 text-white'}`}>
          {toastMessage.type === 'error' ? <AlertTriangle className="w-4 h-4" /> : toastMessage.type === 'warning' ? <Info className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
          {toastMessage.text}
        </div>
      )}

      {/* --- Global Confirm Dialog --- */}
      {confirmDialog && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
           <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 animate-in zoom-in-95 duration-200 text-center">
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-800 mb-2">אישור פעולה</h3>
              <p className="text-slate-600 mb-6 text-sm">{confirmDialog.message}</p>
              <div className="flex gap-3 justify-center">
                <button onClick={() => setConfirmDialog(null)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors">ביטול</button>
                <button onClick={() => { confirmDialog.onConfirm(); setConfirmDialog(null); }} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors">אשר ומחק</button>
              </div>
           </div>
        </div>
      )}

      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-slate-900/60 z-40 md:hidden backdrop-blur-sm transition-opacity" onClick={() => setIsMobileMenuOpen(false)} />
      )}

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

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="bg-white p-3 md:p-6 shadow-sm border-b border-slate-200 flex justify-between items-center z-10 print:hidden">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden text-slate-500 hover:text-indigo-600 p-2 rounded-lg hover:bg-indigo-50 transition-colors"><Menu className="w-6 h-6" /></button>
            <h2 className="text-lg md:text-2xl font-bold text-slate-800 truncate">{navItems.find(item => item.id === activeTab)?.label}</h2>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <div className="hidden md:block text-sm text-slate-500">שלום, <span className="font-semibold text-slate-700">{currentUserName}</span></div>
            {userRole === 'admin' && (
              <button onClick={() => setIsUserManageModalOpen(true)} className="text-xs md:text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 px-2 py-1.5 md:px-3 md:py-1.5 rounded-lg transition-colors border border-transparent flex items-center gap-1.5">
                <UserCog className="w-4 h-4" /> ניהול משתמשים
              </button>
            )}
            <button onClick={() => { setUserRole(null); setCurrentUserName(''); setUsername(''); setPassword(''); setLoginError(''); }} className="text-xs md:text-sm font-medium text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1.5 md:px-3 md:py-1.5 rounded-lg transition-colors border border-transparent">התנתק</button>
            <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-sm md:text-base ${userRole === 'admin' ? 'bg-indigo-100 border-2 border-indigo-200 text-indigo-700' : 'bg-slate-100 border-2 border-slate-200 text-slate-600'}`}>{userRole === 'admin' ? 'מ' : 'צ'}</div>
          </div>
        </header>

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
                      <>
                        <button onClick={() => setIsUpdateStockModalOpen(true)} className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 md:py-2.5 rounded-lg text-xs md:text-sm flex items-center justify-center gap-1.5 md:gap-2 whitespace-nowrap"><RefreshCw className="w-3.5 h-3.5 md:w-4 md:h-4" /> עדכון ידני</button>
                        <button onClick={() => setIsAddBookModalOpen(true)} className="col-span-2 sm:col-span-1 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 md:py-2.5 rounded-lg text-xs md:text-sm flex items-center justify-center gap-1.5 md:gap-2 shadow-sm whitespace-nowrap"><Plus className="w-3.5 h-3.5 md:w-4 md:h-4" /> הוסף ספר</button>
                      </>
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
                              {book.breakdown && book.breakdown.length > 0 ? book.breakdown.map((item, idx) => (
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
                    <div className="pt-5 mt-4 border-t border-slate-50 flex gap-2 flex-col">
                      <button onClick={() => setSelectedSupplierForStock(supplier)} className="w-full flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-700 py-2.5 rounded-lg text-sm font-medium transition-colors"><Package className="w-4 h-4" /> צפה במלאי</button>
                      {userRole === 'admin' && (
                        <button onClick={() => openSupplierInvoice(supplier)} className="w-full flex items-center justify-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 py-2.5 rounded-lg text-sm font-medium transition-colors"><Receipt className="w-4 h-4" /> הפק הזמנה / קבלה</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PRODUCTION (KANBAN) VIEW */}
          {activeTab === 'production' && (
            <div className="flex flex-col h-full animate-in fade-in duration-300">
              {userRole === 'admin' && (
                <div className="flex justify-end mb-4">
                  <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-2 opacity-50 cursor-not-allowed" title="בקרוב">
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
                        {tasks[col.id]?.map((task) => {
                          const totalExpenses = task.invoices ? task.invoices.reduce((sum, inv) => sum + (inv.amount || 0), 0) : 0;
                          const filesCount = (task.coverFile ? 1 : 0) + (task.bookFile ? 1 : 0) + (task.dedicationFile ? 1 : 0);
                          
                          return (
                            <div key={task.id} onClick={() => setSelectedTask(task)} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all hover:border-indigo-200 cursor-pointer group">
                              <h4 className="font-bold text-slate-800 mb-1 group-hover:text-indigo-600 transition-colors">{task.title}</h4>
                              <p className="text-sm text-slate-500 mb-3">מאת: {task.author}</p>
                              
                              <div className="flex flex-wrap gap-2 mb-3">
                                {filesCount > 0 && <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-1 rounded-md"><Paperclip className="w-3 h-3" />{filesCount} קבצים</span>}
                                {totalExpenses > 0 && <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-red-50 text-red-600 px-2 py-1 rounded-md"><DollarSign className="w-3 h-3" />₪{totalExpenses.toLocaleString()} הוצאות</span>}
                              </div>

                              <div className="flex justify-between items-center text-xs text-slate-400 mt-2 pt-3 border-t border-slate-50">
                                <span>יעד סיום:</span><span className="bg-slate-50 px-2 py-1 rounded-md text-slate-600">{task.date}</span>
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

          {/* MARKETING AND PR VIEW */}
          {activeTab === 'marketing' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 animate-in fade-in duration-300 w-full">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col w-full overflow-hidden">
                <div className="p-4 md:p-6 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="text-base md:text-lg font-bold flex items-center gap-2"><Megaphone className="w-5 h-5 text-indigo-600" /> קמפיינים</h3>
                  {userRole === 'admin' && <button onClick={() => setIsAddCampaignModalOpen(true)} className="text-xs md:text-sm font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg flex items-center gap-1"><Plus className="w-4 h-4" /> הוסף</button>}
                </div>
                <div className="p-4 md:p-6 space-y-5 md:space-y-6">
                  {campaignsList.map(camp => (
                    <div key={camp.id} className="space-y-2 relative group">
                       <div className="flex justify-between items-center gap-2">
                           <div className="font-bold text-xs md:text-sm text-slate-700 truncate pr-6">{camp.name}</div>
                           <div className="text-[10px] md:text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 md:py-1 rounded shrink-0">החזר: {camp.roas}</div>
                           {userRole === 'admin' && <button onClick={() => { setEditingCampaign(camp); setIsEditCampaignModalOpen(true); }} className="absolute right-0 top-0 p-1 text-slate-300 hover:text-indigo-600 bg-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"><Edit className="w-4 h-4" /></button>}
                       </div>
                       <div className="flex justify-between text-[10px] md:text-xs text-slate-500">
                           <span>נוצל: ₪{Number(camp.spent).toLocaleString()}</span><span>מתוך ₪{Number(camp.budget).toLocaleString()}</span>
                       </div>
                       <div className="w-full bg-slate-100 rounded-full h-1.5 md:h-2"><div className="bg-indigo-500 h-1.5 md:h-2 rounded-full" style={{ width: `${(Number(camp.spent)/Number(camp.budget))*100}%`}}></div></div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col w-full overflow-hidden">
                <div className="p-4 md:p-6 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="text-base md:text-lg font-bold text-slate-800 flex items-center gap-2"><Share2 className="w-5 h-5 text-pink-500" /> עותקי סיקור ויח"צ</h3>
                  {userRole === 'admin' && <button onClick={() => setIsAddPrModalOpen(true)} className="text-xs md:text-sm font-medium text-pink-600 hover:text-pink-700 bg-pink-50 px-3 py-1.5 rounded-lg flex items-center gap-1"><Plus className="w-4 h-4" /> חדש</button>}
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
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-slate-800 text-white flex items-center justify-center text-lg md:text-xl font-bold">{int.logo}</div>
                      <div className="flex flex-col items-end gap-1.5">
                        <button onClick={() => handleToggleIntegration(int.id)} disabled={userRole !== 'admin'} className={`w-10 md:w-12 h-5 md:h-6 rounded-full transition-colors relative focus:outline-none ${int.connected ? 'bg-emerald-500' : 'bg-slate-300'} ${userRole !== 'admin' && 'opacity-70 cursor-not-allowed'}`}>
                          <span className={`absolute top-0.5 md:top-1 bg-white w-4 h-4 rounded-full transition-all shadow-sm ${int.connected ? 'left-1' : 'right-1'}`} />
                        </button>
                        <span className={`text-[10px] md:text-xs font-medium ${int.connected ? 'text-emerald-600' : 'text-slate-400'}`}>{int.connected ? 'מחובר' : 'מנותק'}</span>
                      </div>
                    </div>
                    <h4 className="text-base md:text-lg font-bold text-slate-800">{int.name}</h4>
                    <p className="text-xs md:text-sm text-slate-500 mb-6">{int.type}</p>
                    <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                      <div className="text-[10px] md:text-xs text-slate-400">סנכרון אחרון:<br/><span className="text-slate-600 font-medium">{int.lastSync}</span></div>
                      <button onClick={() => handleSync(int.id)} disabled={!int.connected || isSyncing === int.id || userRole !== 'admin'} className={`flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-colors ${!int.connected || userRole !== 'admin' ? 'bg-slate-50 text-slate-400 cursor-not-allowed' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}><RefreshCw className={`w-3.5 h-3.5 md:w-4 md:h-4 ${isSyncing === int.id ? 'animate-spin' : ''}`} /> סנכרן</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>

      {/* --- MODALS --- */}
      {isUserManageModalOpen && userRole === 'admin' && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col" dir="rtl">
            <div className="p-4 md:p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
              <h3 className="font-bold text-base md:text-lg text-slate-800 flex items-center gap-2"><UserCog className="w-5 h-5 text-indigo-600" /> ניהול משתמשים והרשאות</h3>
              <button onClick={() => setIsUserManageModalOpen(false)} className="text-slate-400 hover:text-slate-600 bg-white p-1.5 rounded-md shadow-sm border border-slate-200"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="p-4 md:p-6 overflow-y-auto flex-1 flex flex-col lg:flex-row gap-6">
              
              <div className="flex-1">
                <h4 className="font-bold text-sm text-slate-700 mb-3 border-b border-slate-100 pb-2">משתמשים פעילים</h4>
                <div className="space-y-2">
                  {usersList.map((u, idx) => (
                    <div key={idx} className="bg-slate-50 border border-slate-100 p-3 rounded-lg flex justify-between items-center">
                      <div><div className="font-bold text-sm text-slate-800">{u.name}</div><div className="text-xs text-slate-500 font-mono">@{u.username}</div></div>
                      <div className="flex items-center gap-3">
                        <span className={`text-[10px] px-2 py-1 rounded font-medium ${u.role === 'admin' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200 text-slate-600'}`}>{u.role === 'admin' ? 'מנהל' : 'צופה'}</span>
                        <button onClick={() => handleRemoveUser(u.username)} className="text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex-1 bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
                <h4 className="font-bold text-sm text-indigo-900 mb-3 flex items-center gap-2"><UserPlus className="w-4 h-4" /> יצירת משתמש חדש</h4>
                <form onSubmit={handleCreateUser} className="space-y-3">
                  <div><label className="block text-xs font-medium text-slate-700 mb-1">שם מלא</label><input required type="text" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} className="w-full p-2 border rounded-lg bg-white text-sm" placeholder="למשל: דנה לוי" /></div>
                  <div><label className="block text-xs font-medium text-slate-700 mb-1">שם משתמש (באנגלית)</label><input required type="text" value={newUser.username} onChange={e => setNewUser({...newUser, username: e.target.value})} className="w-full p-2 border rounded-lg bg-white text-sm" dir="ltr" /></div>
                  <div><label className="block text-xs font-medium text-slate-700 mb-1">סיסמה</label><input required type="text" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} className="w-full p-2 border rounded-lg bg-white text-sm" dir="ltr" /></div>
                  <div><label className="block text-xs font-medium text-slate-700 mb-1">אימייל (לשליחת פרטים)</label><input required type="email" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} className="w-full p-2 border rounded-lg bg-white text-sm" dir="ltr" placeholder="דוא״ל הנמען" /></div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">הרשאה</label>
                    <select value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})} className="w-full p-2 border rounded-lg bg-white text-sm">
                      <option value="viewer">צופה (קריאה בלבד)</option>
                      <option value="admin">מנהל מערכת (גישה מלאה)</option>
                    </select>
                  </div>
                  <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg text-sm font-medium mt-2 flex justify-center items-center gap-2">
                    <Send className="w-4 h-4" /> צור משתמש ושלח למייל
                  </button>
                </form>
              </div>

            </div>
          </div>
        </div>
      )}

      {isSupplierInvoiceModalOpen && invoiceSupplier && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col" dir="rtl">
            <div className="p-4 md:p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
              <div>
                <h3 className="font-bold text-base md:text-lg text-slate-800 flex items-center gap-2"><Receipt className="w-5 h-5 text-indigo-600" /> הפקת קבלה / הזמנה</h3>
                <p className="text-sm text-slate-500">עבור הספק/רשת: <span className="font-bold text-slate-700">{invoiceSupplier.name}</span></p>
              </div>
              <button onClick={() => setIsSupplierInvoiceModalOpen(false)} className="text-slate-400 hover:text-slate-600 bg-white p-1.5 rounded-md shadow-sm border border-slate-200"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="p-4 md:p-6 overflow-y-auto flex-1">
              <div className="flex justify-between items-end mb-3">
                <h4 className="font-bold text-sm text-slate-700">פירוט ספרים בהזמנה</h4>
                <button type="button" onClick={addInvoiceItemRow} className="text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-lg transition-colors font-medium flex items-center gap-1"><Plus className="w-3 h-3" /> הוסף שורה</button>
              </div>

              <div className="space-y-3 mb-6">
                {invoiceItems.map((item, idx) => (
                  <div key={idx} className="flex flex-wrap md:flex-nowrap gap-2 items-center bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <select value={item.bookId} onChange={(e) => handleInvoiceItemChange(idx, 'bookId', e.target.value)} className="w-full md:flex-1 p-2 border border-slate-200 rounded-lg text-sm bg-white outline-none">
                      <option value="" disabled>-- בחר ספר --</option>
                      {inventoryList.map(book => <option key={book.id} value={book.id}>{book.title}</option>)}
                    </select>
                    
                    <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
                      <div className="flex items-center gap-1.5">
                        <label className="text-[10px] md:text-xs text-slate-500">כמות:</label><input type="number" min="1" value={item.amount} onChange={(e) => handleInvoiceItemChange(idx, 'amount', e.target.value)} className="w-16 p-2 border border-slate-200 rounded-lg text-sm text-center bg-white" dir="ltr" />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <label className="text-[10px] md:text-xs text-slate-500">מחיר (₪):</label><input type="number" min="0" value={item.price} onChange={(e) => handleInvoiceItemChange(idx, 'price', e.target.value)} className="w-20 p-2 border border-slate-200 rounded-lg text-sm text-center bg-white text-indigo-600 font-bold" dir="ltr" />
                      </div>
                      <button type="button" onClick={() => removeInvoiceItemRow(idx)} className="text-slate-400 hover:text-red-500 p-1.5 bg-white rounded border border-slate-200"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
                {invoiceItems.length === 0 && <p className="text-sm text-slate-500 text-center py-4 bg-slate-50 rounded-lg border border-dashed border-slate-200">לא נבחרו ספרים להזמנה.</p>}
              </div>

              <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100 flex justify-between items-center mb-6">
                <span className="font-bold text-emerald-900 text-sm md:text-base">סה"כ הזמנה לתשלום:</span>
                <span className="text-xl md:text-2xl font-bold text-emerald-600">₪{invoiceItems.reduce((acc, item) => acc + (item.amount * item.price), 0).toLocaleString()}</span>
              </div>

              <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100">
                <h4 className="font-bold text-sm text-blue-900 mb-2">שליחה לספק</h4>
                <p className="text-xs text-slate-600 mb-3">הודעת דוא״ל תשלח אוטומטית ברקע לכתובת <strong>{invoiceSupplier.email}</strong>.</p>
                <button onClick={sendInvoiceEmail} disabled={invoiceItems.length === 0 || !invoiceItems[0].bookId} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white disabled:bg-slate-300 disabled:cursor-not-allowed py-3 rounded-xl font-medium flex justify-center items-center gap-2 transition-colors">
                  <Send className="w-4 h-4" /> צור ושלח פירוט הזמנה למייל
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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

      {isAddSupplierModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col" dir="rtl">
            <div className="p-4 md:p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
              <h3 className="font-bold text-base md:text-lg text-slate-800">הוספת ספק / רשת</h3>
              <button onClick={() => setIsAddSupplierModalOpen(false)} className="text-slate-400 hover:text-slate-600 bg-white p-1.5 rounded-md shadow-sm border border-slate-200"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-4 md:p-6 overflow-y-auto">
              <form onSubmit={handleAddSupplier} className="space-y-4">
                <div><label className="block text-sm font-medium mb-1">שם הספק</label><input required type="text" value={newSupplier.name} onChange={e => setNewSupplier({...newSupplier, name: e.target.value})} className="w-full p-2.5 md:p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 bg-slate-50" /></div>
                <div><label className="block text-sm font-medium mb-1">סוג</label><select value={newSupplier.type} onChange={e => setNewSupplier({...newSupplier, type: e.target.value})} className="w-full p-2.5 md:p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 bg-slate-50"><option>רשת קמעונאית</option><option>הפצה</option><option>מחסן לוגיסטי</option><option>בית דפוס</option></select></div>
                <div><label className="block text-sm font-medium mb-1">סטטוס</label><select value={newSupplier.status} onChange={e => setNewSupplier({...newSupplier, status: e.target.value})} className="w-full p-2.5 md:p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 bg-slate-50"><option>פעיל - יש הסכם</option><option>ללא הסכם מכירה</option><option>ממתין לספרים</option><option>אין שיתוף פעולה</option></select></div>
                <div><label className="block text-sm font-medium mb-1">איש קשר</label><input required type="text" value={newSupplier.contact} onChange={e => setNewSupplier({...newSupplier, contact: e.target.value})} className="w-full p-2.5 md:p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 bg-slate-50" /></div>
                <div><label className="block text-sm font-medium mb-1">טלפון</label><input required type="text" value={newSupplier.phone} onChange={e => setNewSupplier({...newSupplier, phone: e.target.value})} className="w-full p-2.5 md:p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 bg-slate-50" dir="ltr" /></div>
                <div><label className="block text-sm font-medium mb-1">אימייל</label><input required type="email" value={newSupplier.email} onChange={e => setNewSupplier({...newSupplier, email: e.target.value})} className="w-full p-2.5 md:p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 bg-slate-50" dir="ltr" /></div>
                <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium mt-4">הוסף ספק למערכת</button>
              </form>
            </div>
          </div>
        </div>
      )}

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
                <div><label className="block text-sm font-medium mb-1">אימייל</label><input required type="email" value={editingSupplier.email} onChange={e => setEditingSupplier({...editingSupplier, email: e.target.value})} className="w-full p-2.5 md:p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 bg-slate-50" dir="ltr" /></div>
                <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium mt-4">שמור שינויים</button>
              </form>
            </div>
          </div>
        </div>
      )}

      {isAddCampaignModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200" dir="rtl">
            <div className="p-4 md:p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-base md:text-lg text-slate-800">הוספת קמפיין שיווק חדש</h3>
              <button onClick={() => setIsAddCampaignModalOpen(false)} className="text-slate-400 hover:text-slate-600 bg-white p-1.5 rounded-md border border-slate-200"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-4 md:p-5">
              <form onSubmit={handleAddCampaignSubmit} className="space-y-4">
                <div><label className="block text-sm font-medium mb-1">שם הקמפיין</label><input type="text" required value={newCampaign.name} onChange={e => setNewCampaign({...newCampaign, name: e.target.value})} className="w-full p-2.5 md:p-2 border rounded-lg bg-slate-50 focus:bg-white" /></div>
                <div><label className="block text-sm font-medium mb-1">ספר מקודם</label><input type="text" required value={newCampaign.book} onChange={e => setNewCampaign({...newCampaign, book: e.target.value})} className="w-full p-2.5 md:p-2 border rounded-lg bg-slate-50 focus:bg-white" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="block text-sm font-medium mb-1">תקציב (₪)</label><input type="number" required value={newCampaign.budget} onChange={e => setNewCampaign({...newCampaign, budget: Number(e.target.value)})} className="w-full p-2.5 md:p-2 border rounded-lg bg-slate-50 focus:bg-white" dir="ltr" /></div>
                  <div><label className="block text-sm font-medium mb-1">נוצל (₪)</label><input type="number" required value={newCampaign.spent} onChange={e => setNewCampaign({...newCampaign, spent: Number(e.target.value)})} className="w-full p-2.5 md:p-2 border rounded-lg bg-slate-50 focus:bg-white" dir="ltr" /></div>
                </div>
                <div><label className="block text-sm font-medium mb-1">החזר / תוצאה (ROAS)</label><input type="text" required value={newCampaign.roas} onChange={e => setNewCampaign({...newCampaign, roas: e.target.value})} className="w-full p-2.5 md:p-2 border rounded-lg bg-slate-50 focus:bg-white" dir="ltr" placeholder="לדוגמה: 2.5x" /></div>
                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 md:py-2.5 rounded-xl font-medium mt-2">הוסף קמפיין למערכת</button>
              </form>
            </div>
          </div>
        </div>
      )}

      {isEditCampaignModalOpen && editingCampaign && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200" dir="rtl">
            <div className="p-4 md:p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-base md:text-lg text-slate-800">עריכת קמפיין שיווק</h3>
              <button onClick={() => setIsEditCampaignModalOpen(false)} className="text-slate-400 hover:text-slate-600 bg-white p-1.5 rounded-md"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-4 md:p-5">
              <form onSubmit={handleEditCampaignSubmit} className="space-y-4">
                <div><label className="block text-sm font-medium mb-1">שם הקמפיין</label><input type="text" required value={editingCampaign.name} onChange={e => setEditingCampaign({...editingCampaign, name: e.target.value})} className="w-full p-2.5 md:p-2 border rounded-lg bg-slate-50 focus:bg-white" /></div>
                <div><label className="block text-sm font-medium mb-1">ספר מקודם</label><input type="text" required value={editingCampaign.book} onChange={e => setEditingCampaign({...editingCampaign, book: e.target.value})} className="w-full p-2.5 md:p-2 border rounded-lg bg-slate-50 focus:bg-white" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="block text-sm font-medium mb-1">תקציב (₪)</label><input type="number" required value={editingCampaign.budget} onChange={e => setEditingCampaign({...editingCampaign, budget: Number(e.target.value)})} className="w-full p-2.5 md:p-2 border rounded-lg bg-slate-50 focus:bg-white" dir="ltr" /></div>
                  <div><label className="block text-sm font-medium mb-1">נוצל (₪)</label><input type="number" required value={editingCampaign.spent} onChange={e => setEditingCampaign({...editingCampaign, spent: Number(e.target.value)})} className="w-full p-2.5 md:p-2 border rounded-lg bg-slate-50 focus:bg-white" dir="ltr" /></div>
                </div>
                <div><label className="block text-sm font-medium mb-1">החזר / תוצאה (ROAS)</label><input type="text" required value={editingCampaign.roas} onChange={e => setEditingCampaign({...editingCampaign, roas: e.target.value})} className="w-full p-2.5 md:p-2 border rounded-lg bg-slate-50 focus:bg-white" dir="ltr" /></div>
                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 md:py-2.5 rounded-xl font-medium mt-2">שמור קמפיין</button>
              </form>
            </div>
          </div>
        </div>
      )}

      {isAddPrModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200" dir="rtl">
            <div className="p-4 md:p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-base md:text-lg text-slate-800">הוספת עותק סיקור / יח"צ</h3>
              <button onClick={() => setIsAddPrModalOpen(false)} className="text-slate-400 hover:text-slate-600 bg-white p-1.5 rounded-md border border-slate-200"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-4 md:p-5">
              <form onSubmit={handleAddPrSubmit} className="space-y-4">
                <div><label className="block text-sm font-medium mb-1">נמען (משפיען/מבקר)</label><input type="text" required value={newPr.recipient} onChange={e => setNewPr({...newPr, recipient: e.target.value})} className="w-full p-2.5 md:p-2 border rounded-lg bg-slate-50" placeholder="לדוגמה: מוסף ספרים הארץ" /></div>
                <div><label className="block text-sm font-medium mb-1">ספר נשלח</label><input type="text" required value={newPr.book} onChange={e => setNewPr({...newPr, book: e.target.value})} className="w-full p-2.5 md:p-2 border rounded-lg bg-slate-50" /></div>
                <div>
                  <label className="block text-sm font-medium mb-1">סטטוס מול המשפיען</label>
                  <select value={newPr.status} onChange={e => setNewPr({...newPr, status: e.target.value})} className="w-full p-2.5 md:p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white">
                    <option>במשלוח</option><option>נמסר ליעד</option><option>פורסמה ביקורת</option><option>לא פורסם</option>
                  </select>
                </div>
                <button type="submit" className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 md:py-2.5 rounded-xl font-medium mt-2">שמור פעילות יח"צ</button>
              </form>
            </div>
          </div>
        </div>
      )}

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
                  <select required value={stockUpdateForm.bookId} onChange={e => setStockUpdateForm({...stockUpdateForm, bookId: e.target.value})} className="w-full p-2.5 md:p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-slate-50 text-sm">
                    <option value="" disabled>-- בחר מספרייה --</option>
                    {inventoryList.map(book => <option key={book.id} value={book.id}>{book.title} (במחסן ההוצאה: {book.publisherStock})</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">כמות לעדכון</label>
                  <input required type="number" value={stockUpdateForm.amount} onChange={e => setStockUpdateForm({...stockUpdateForm, amount: e.target.value})} className="w-full p-2.5 md:p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-slate-50" placeholder="למשל: 50 או -20" dir="ltr" />
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
                    סה"כ: ₪{(selectedTask.invoices || []).reduce((s, i) => s + (i.amount || 0), 0).toLocaleString()}
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
                      {(selectedTask.invoices || []).map(inv => (
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
                      {(!selectedTask.invoices || selectedTask.invoices.length === 0) && (
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
