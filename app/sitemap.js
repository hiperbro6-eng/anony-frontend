export default function sitemap() {
  const baseUrl = 'https://wathsustores.com'; 

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    //  "Cart" page you want Google to see:
    // {
    //   url: `${baseUrl}/cart`,
    //   lastModified: new Date(),
    //   changeFrequency: 'monthly',
    //   priority: 0.5,
    // },
  ];
}