import PouchDB from 'pouchdb';

// Create or open database with better configuration
const db = new PouchDB('hospital_db', {
  auto_compaction: true,
  revs_limit: 1000
});

// Add logging for database operations
const logOperation = (operation: string, details?: any) => {
  console.log(`[DB ${operation}]`, details ? details : '');
};

// Generic functions to manage documents with better error handling
export const getAllDocs = async (): Promise<any[]> => {
  try {
    logOperation('GET_ALL_DOCS');
    const result = await db.allDocs({
      include_docs: true
    });
    
    const docs = result.rows
      .map(row => row.doc)
      .filter(doc => doc && !doc._id.startsWith('_design/'));
    
    logOperation('GET_ALL_DOCS_SUCCESS', { count: docs.length });
    return docs;
  } catch (error) {
    logOperation('GET_ALL_DOCS_ERROR', { error: error.message });
    console.error('Error getting all documents:', error);
    return [];
  }
};

export const getAllDocsByType = async <T>(type: string): Promise<T[]> => {
  try {
    logOperation('GET_ALL_BY_TYPE', { type });
    const result = await db.allDocs({
      include_docs: true,
      startkey: `${type}_`,
      endkey: `${type}_\ufff0`
    });
    
    const docs = result.rows
      .map(row => row.doc as unknown as T)
      .filter((doc: any) => doc?.type === type);
    
    logOperation('GET_ALL_BY_TYPE_SUCCESS', { type, count: docs.length });
    return docs;
  } catch (error) {
    logOperation('GET_ALL_BY_TYPE_ERROR', { type, error: error.message });
    console.error(`Error getting ${type} documents:`, error);
    return [];
  }
};

export const getDocById = async <T>(id: string): Promise<T | null> => {
  try {
    logOperation('GET_BY_ID', { id });
    const doc = await db.get(id);
    logOperation('GET_BY_ID_SUCCESS', { id });
    return doc as unknown as T;
  } catch (error) {
    if (error.status !== 404) {
      logOperation('GET_BY_ID_ERROR', { id, error: error.message });
      console.error(`Error getting document ${id}:`, error);
    }
    return null;
  }
};

export const addDoc = async <T extends { _id?: string, type: string, createdAt?: string }>(doc: T): Promise<string> => {
  try {
    // Generate ID if not provided
    const docId = doc._id || `${doc.type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    logOperation('ADD_DOC', { id: docId, type: doc.type });
    
    // Add timestamp if not present
    const docWithTimestamp = {
      ...doc,
      _id: docId,
      createdAt: doc.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await db.put(docWithTimestamp);
    logOperation('ADD_DOC_SUCCESS', { id: docId });
    return docId;
  } catch (error) {
    logOperation('ADD_DOC_ERROR', { id: doc._id, error: error.message });
    console.error('Error adding document:', error);
    throw error;
  }
};

export const getDoc = async <T>(id: string): Promise<T | null> => {
  return getDocById<T>(id);
};

export const updateDoc = async (id: string, updates: any): Promise<boolean> => {
  try {
    logOperation('UPDATE_DOC_BY_ID', { id });
    
    // Get current document to preserve _rev
    const existingDoc = await db.get(id);
    
    const updatedDoc = {
      ...existingDoc,
      ...updates,
      _rev: existingDoc._rev,
      updatedAt: new Date().toISOString()
    };
    
    await db.put(updatedDoc);
    logOperation('UPDATE_DOC_BY_ID_SUCCESS', { id });
    return true;
  } catch (error) {
    logOperation('UPDATE_DOC_BY_ID_ERROR', { id, error: error.message });
    console.error('Error updating document:', error);
    return false;
  }
};

export const deleteDoc = async (id: string, rev?: string): Promise<boolean> => {
  try {
    logOperation('DELETE_DOC', { id });
    
    // If no rev provided, get current document
    if (!rev) {
      const doc = await db.get(id);
      rev = doc._rev;
    }
    
    await db.remove(id, rev);
    logOperation('DELETE_DOC_SUCCESS', { id });
    return true;
  } catch (error) {
    logOperation('DELETE_DOC_ERROR', { id, error: error.message });
    console.error(`Error deleting document ${id}:`, error);
    return false;
  }
};

// New utility functions for better data management
export const getDocCount = async (type?: string): Promise<number> => {
  try {
    if (type) {
      const docs = await getAllDocsByType(type);
      return docs.length;
    } else {
      const result = await db.allDocs();
      return result.total_rows;
    }
  } catch (error) {
    console.error('Error getting document count:', error);
    return 0;
  }
};

export const searchDocs = async <T>(type: string, searchField: string, searchValue: string): Promise<T[]> => {
  try {
    const docs = await getAllDocsByType<T>(type);
    return docs.filter((doc: any) => 
      doc[searchField]?.toLowerCase().includes(searchValue.toLowerCase())
    );
  } catch (error) {
    console.error('Error searching documents:', error);
    return [];
  }
};

// Database info and health check
export const getDatabaseInfo = async () => {
  try {
    const info = await db.info();
    logOperation('DATABASE_INFO', info);
    return info;
  } catch (error) {
    console.error('Error getting database info:', error);
    return null;
  }
};

export default db;
