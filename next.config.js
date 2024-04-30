/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
        config.externals.push({
            "utf-8-validate": "commonjs utf-8-validate",
            bufferutil: "commonjs bufferutil"
        });

        return config;
    },
    images: {
        domains: [
            "utfs.io",
            "uploadthing.com",
            "i.pinimg.com",
            "lh3.googleusercontent.com",
            'avatars.githubusercontent.com'
        ]
    },
    transpilePackages: ['next-auth'],
}

module.exports = nextConfig


