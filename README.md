# X3 Manga Image Converter V2

A browser-based JPG/PNG manga folder to Xteink X3 XTC/XTCH converter.

## Features
- Select a manga folder and sort chapter folders / image filenames naturally.
- Merge all chapters into one book, export one book per chapter, or merge a chosen chapter range.
- Package chapter books into ZIP files in batches of 5 or 10 (JSZip is loaded from jsDelivr).
- Convert tall images into 528×792 pages.
- Black-and-white XTC or 4-gray XTCH output.
- Images are processed locally in the browser; they are not uploaded.

## GitHub Pages
Upload `index.html`, `app.js`, and this README to the repository root. In Settings → Pages, publish from the `main` branch and `/ (root)`.

## Important
- Folder selection support varies by browser/device. If folder selection is unavailable, multi-file selection may lose chapter folder structure.
- ZIP mode requires internet access to load JSZip from jsDelivr.
- Test output on an Xteink X3 using a small sample before converting a large collection. File format compatibility and large-book memory use are not guaranteed.
- This project adapts encoding logic from `srokl/xtcjsapp` (MIT); preserve applicable license and attribution notices when redistributing.
