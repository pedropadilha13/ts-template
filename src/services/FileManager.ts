import fs from 'fs';
import path from 'path';
import { BaseDir } from '../utils/baseDir';

export class FileManager {
  private filePath: string;
  constructor(public fileName: string, folderName = 'tmp') {
    this.filePath = path.join(BaseDir.baseDir, folderName, fileName);
    this.ensureDirectoryExists(this.filePath);
  }

  read(): string {
    if (fs.existsSync(this.filePath)) {
      const file = fs.readFileSync(this.filePath, { encoding: 'utf8' });
      return file;
    } else {
      throw new Error('File not found');
    }
  }

  write(content: string): void {
    fs.writeFileSync(this.filePath, content, { flag: 'w', encoding: 'utf8' });
  }

  writeBin(content: string): void {
    fs.writeFileSync(this.filePath, content, 'binary');
  }

  append(content: string): void {
    if (fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, content, { flag: 'a', encoding: 'utf8' });
    } else {
      this.write(content);
    }
  }

  delete(): void {
    if (fs.existsSync(this.filePath)) {
      fs.unlinkSync(this.filePath);
    }
  }

  exists(): boolean {
    return fs.existsSync(this.filePath);
  }

  private ensureDirectoryExists(filePath: string): void {
    const dirName = path.dirname(filePath);
    if (fs.existsSync(dirName)) {
      return;
    }

    this.ensureDirectoryExists(dirName);
    fs.mkdirSync(dirName);
  }

  get path(): string {
    return this.filePath;
  }
}
