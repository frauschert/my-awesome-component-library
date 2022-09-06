import type { Config } from 'jest'

const config: Config = {
    testEnvironment: 'jsdom',
    testPathIgnorePatterns: ['<rootDir>/node_modules', '<rootDir>/dist'], // might want?
    moduleNameMapper: {
        '@components(.*)': '<rootDir>/src/components$1', // might want?
        '\\.(css|less|sass|scss)$': '<rootDir>/__mocks__/styleMock.js',
    },
    moduleDirectories: ['<rootDir>/node_modules', '<rootDir>/src'],
    setupFilesAfterEnv: ['<rootDir>/src/jest-setup.ts'], // this is the KEY
    // note it should be in the top level of the exported object.
    transform: {
        '^.+\\.(js|ts|jsx|tsx)$': '<rootDir>/node_modules/babel-jest',
    },
    collectCoverageFrom: [
        '<rootDir>/src/**/*.ts',
        '<rootDir>/src/**/*.tsx',
        '!<rootDir>/src/**/*.stories.tsx',
        '!<rootDir>/src/**/types.ts',
        '!<rootDir>/src/**/index.ts',
    ],
}

export default config
