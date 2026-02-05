const fs = require('fs');
const path = require('path');

const brainDir = 'C:\\Users\\ThuPC\\.gemini\\antigravity\\brain\\31e65013-d1d9-47f2-a968-4cc3cea15899';
const uploadDir = 'c:\\Users\\ThuPC\\Documents\\dcd2\\K22cnt4-lethuonghoaithu-2201900126-thucphamsach\\backend\\src\\uploads';

const files = [
    { src: 'dual_banner_honey_1770188155856.png', dest: 'dual_honey.png' },
    { src: 'dual_banner_spices_1770188173940.png', dest: 'dual_spices.png' },
    { src: 'dual_banner_eggs_1770188193460.png', dest: 'dual_eggs.png' },
    { src: 'dual_banner_tea_1770188207932.png', dest: 'dual_tea.png' }
];

files.forEach(f => {
    try {
        fs.copyFileSync(path.join(brainDir, f.src), path.join(uploadDir, f.dest));
        console.log(`Copied ${f.dest}`);
    } catch (e) {
        console.error(`Error copying ${f.dest}:`, e.message);
    }
});
