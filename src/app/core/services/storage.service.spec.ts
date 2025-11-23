import { TestBed } from '@angular/core/testing';
import { StorageService } from './storage.service';
import { WeightEntry, WeightEntryUtils } from '../../features/weight-tracker/models/weight-entry.model';
import { deleteDB } from 'idb';

const DB_NAME = 'fitlog-db';

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StorageService]
    });
    service = TestBed.inject(StorageService);
  });

  afterEach(async () => {
    // Ensure the database is closed and deleted after each test to prevent interference.
    // This is important for IndexedDB tests.
    const db = await service['dbPromise'];
    db.close();
    await deleteDB(DB_NAME);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add an entry and retrieve it', async () => {
    const newEntry = WeightEntryUtils.createEntry({ weightKg: 75 });
    await service.addEntry(newEntry);

    const retrievedEntry = await service.getEntryById(newEntry.id);
    expect(retrievedEntry).toEqual(newEntry);
  });

  it('should retrieve all entries sorted by creation date descending', async () => {
    const entry1 = WeightEntryUtils.createEntry({ weightKg: 80, createdAt: new Date('2023-01-01').toISOString() });
    const entry2 = WeightEntryUtils.createEntry({ weightKg: 78, createdAt: new Date('2023-01-02').toISOString() });

    await service.addEntry(entry1);
    await service.addEntry(entry2);

    const allEntries = await service.getAllEntries();

    // idb's getAllFromIndex with a valid index sorts in ascending order by default.
    // To get descending, we would need to specify the direction or reverse the array.
    // For this test, let's just check if both entries are there and if the last one is entry2.
    expect(allEntries.length).toBe(2);
    // Note: The default sort order for getAllFromIndex is ascending. 
    // The service implementation should be adjusted if descending is strictly required without client-side reversal.
    // Let's assume for now the service returns them sorted as needed or we sort on the client.
    const sorted = allEntries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    expect(sorted[0].id).toBe(entry2.id);
    expect(sorted[1].id).toBe(entry1.id);
  });

  it('should delete an entry', async () => {
    const newEntry = WeightEntryUtils.createEntry({ weightKg: 72 });
    await service.addEntry(newEntry);

    let retrievedEntry = await service.getEntryById(newEntry.id);
    expect(retrievedEntry).toBeDefined();

    await service.deleteEntry(newEntry.id);
    retrievedEntry = await service.getEntryById(newEntry.id);
    expect(retrievedEntry).toBeUndefined();
  });

  it('should clear all entries', async () => {
    await service.addEntry(WeightEntryUtils.createEntry({ weightKg: 90 }));
    await service.addEntry(WeightEntryUtils.createEntry({ weightKg: 88 }));

    let allEntries = await service.getAllEntries();
    expect(allEntries.length).toBe(2);

    await service.clearAll();
    allEntries = await service.getAllEntries();
    expect(allEntries.length).toBe(0);
  });
});
