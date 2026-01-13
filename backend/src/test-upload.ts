import 'dotenv/config';
import { prisma } from './config/database';

async function testUploadFlow() {
  console.log('🧪 Testing Database & Upload Flow\n');
  console.log('=' .repeat(60));

  try {
    // Test 1: Create a test user
    console.log('\n📋 Test 1: Creating test user...');

    const user = await prisma.user.create({
      data: {
        email: 'test@mythedit.com',
        name: 'Test User',
      },
    });

    console.log(`✅ User created: ${user.name} (${user.email})`);

    // Test 2: Create a project
    console.log('\n📋 Test 2: Creating test project...');

    const project = await prisma.project.create({
      data: {
        userId: user.id,
        name: 'The Shadow Chronicles',
        description: 'A 10-book epic fantasy series',
        genre: 'Epic Fantasy',
      },
    });

    console.log(`✅ Project created: ${project.name}`);

    // Test 3: Create a book
    console.log('\n📋 Test 3: Creating test book...');

    const book = await prisma.book.create({
      data: {
        projectId: project.id,
        number: 1,
        title: 'The Awakening',
      },
    });

    console.log(`✅ Book created: Book ${book.number} - ${book.title}`);

    // Test 4: Create a chapter
    console.log('\n📋 Test 4: Creating test chapter...');

    const chapterContent = `Chapter 1: The Call

Alaric Stormwind stood atop the windswept tower, gazing across the frozen wasteland that had once been the kingdom of Eloria. Three years had passed since the Shadow War, and still the scars remained.

"You can't keep running forever," a voice called from below.

He turned to see Brenna climbing the last few steps, her breath forming clouds in the frigid air. She'd been his friend since childhood, and the only one who understood why he'd exiled himself here.

"I'm not running," Alaric replied. "I'm waiting."

"For what?"

He held up the letter that had arrived that morning. The seal of the High Council was unmistakable.

"They're calling me back. They need me to find the Soulblade."`;

    const chapter = await prisma.chapter.create({
      data: {
        bookId: book.id,
        number: 1,
        title: 'The Call',
        content: chapterContent,
        wordCount: chapterContent.split(/\s+/).length,
        status: 'PENDING',
      },
    });

    console.log(`✅ Chapter created: Chapter ${chapter.number} - ${chapter.title}`);
    console.log(`   Word count: ${chapter.wordCount} words`);
    console.log(`   Status: ${chapter.status}`);

    // Test 5: Query the full structure
    console.log('\n📋 Test 5: Querying full project structure...');

    const fullProject = await prisma.project.findUnique({
      where: { id: project.id },
      include: {
        books: {
          include: {
            chapters: true,
          },
        },
      },
    });

    console.log(`✅ Retrieved project with:`);
    console.log(`   - ${fullProject?.books.length} book(s)`);
    console.log(`   - ${fullProject?.books[0]?.chapters.length} chapter(s)`);

    // Cleanup
    console.log('\n🧹 Cleaning up test data...');
    await prisma.chapter.delete({ where: { id: chapter.id } });
    await prisma.book.delete({ where: { id: book.id } });
    await prisma.project.delete({ where: { id: project.id } });
    await prisma.user.delete({ where: { id: user.id } });
    console.log('✅ Cleanup complete');

    console.log('\n' + '=' .repeat(60));
    console.log('✅ ALL TESTS PASSED!');
    console.log('\nDatabase integration is working perfectly.');
    console.log('Ready for chapter upload API testing!\n');

  } catch (error) {
    console.error('\n❌ TEST FAILED:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testUploadFlow();
