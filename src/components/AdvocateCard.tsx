import { Advocate } from "../types/advocate";
import { formatPhoneNumber } from "../utils/phone";

type AdvocateCardProps = {
  advocate: Advocate;
  isExpanded: boolean;
  onToggleSpecialties: (advocateId: number) => void;
};

export function AdvocateCard({
  advocate,
  isExpanded,
  onToggleSpecialties,
}: AdvocateCardProps) {
  const visibleSpecialties = isExpanded
    ? advocate.specialties
    : advocate.specialties.slice(0, 3);

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 overflow-hidden flex flex-col h-full">
      <div className="flex-1 flex flex-col">
        <div className="p-6 pb-4">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white font-bold text-xl">
                {advocate.firstName[0]}
                {advocate.lastName[0]}
              </div>
              <div className="mt-2 flex items-center justify-center">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`h-3 w-3 ${i < 4 ? "text-yellow-400" : "text-gray-300"}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                {advocate.firstName} {advocate.lastName}
              </h3>
              <div className="flex items-center text-gray-600 mb-2">
                <svg
                  className="h-4 w-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="text-sm">{advocate.city}</span>
              </div>
              <div className="flex items-center text-emerald-600 mb-1">
                <svg
                  className="h-4 w-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-sm font-medium">Verified Advocate</span>
              </div>
              <p className="text-sm text-gray-600">
                {advocate.degree} • {advocate.yearsOfExperience} years experience
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 pb-4">
          <h4 className="text-sm font-medium text-gray-900 mb-3">
            Specializations
          </h4>
          <div className="flex flex-wrap gap-2">
            {visibleSpecialties.map((specialty, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200"
              >
                {specialty}
              </span>
            ))}
            {advocate.specialties.length > 3 && (
              <button
                onClick={() => onToggleSpecialties(advocate.id)}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors border border-gray-200"
                aria-label={
                  isExpanded
                    ? "Show fewer specialties"
                    : `Show ${advocate.specialties.length - 3} more specialties`
                }
              >
                {isExpanded
                  ? "Show less"
                  : `+${advocate.specialties.length - 3} more`}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-gray-600">
            <svg
              className="h-4 w-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            <span className="text-xs">Available Now</span>
          </div>
          <a
            href={`tel:${advocate.phoneNumber}`}
            className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors"
            aria-label={`Call ${advocate.firstName} ${advocate.lastName} at ${formatPhoneNumber(advocate.phoneNumber)}`}
          >
            <svg
              className="h-4 w-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            Call Now
          </a>
        </div>
      </div>
    </div>
  );
}
