import { datadogRum, Site } from "@datadog/browser-rum";
import packageJson from "../package.json";
import { getOrCreateUserId } from "./user-tracking";

export const initDatadogRum = () => {
  if (
    globalThis.window !== undefined &&
    process.env.NEXT_PUBLIC_DATADOG_APPLICATION_ID &&
    process.env.NEXT_PUBLIC_DATADOG_CLIENT_TOKEN &&
    process.env.NEXT_PUBLIC_DATADOG_SITE
  ) {
    if (datadogRum.getInternalContext()) {
      return;
    }

    datadogRum.init({
      applicationId: process.env.NEXT_PUBLIC_DATADOG_APPLICATION_ID,
      clientToken: process.env.NEXT_PUBLIC_DATADOG_CLIENT_TOKEN,
      site: process.env.NEXT_PUBLIC_DATADOG_SITE as Site,
      service: packageJson.name,
      env: process.env.NODE_ENV,
      version: packageJson.version,
      sessionSampleRate: 100,
      sessionReplaySampleRate: 100,
      trackUserInteractions: true,
      trackResources: true,
      trackLongTasks: true,
      defaultPrivacyLevel: "allow",
      proxy: "/api/datadog",
    });

    datadogRum.setGlobalContextProperty("app", packageJson.name);
    datadogRum.setGlobalContextProperty("version", packageJson.version);

    const userId = getOrCreateUserId();
    datadogRum.setUser({
      id: userId,
    });

    datadogRum.startSessionReplayRecording();
  }
};
